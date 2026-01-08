import {
  computed,
  inject,
  provide,
  shallowRef,
  useRoute,
  useRouter,
  watch,
  defineAsyncComponent,
  type Component,
} from '#imports'
import type { ShallowRef } from 'vue'
import { createHooks } from 'hookable'

type AsyncComponentLoader = () => Promise<Component | { default: Component }>

export type ComponentRouteRecord = {
  path: string
  component: Component | AsyncComponentLoader
  name?: string
}

export type ComponentRouterMode = 'query' | 'hash' | 'memory'

export interface UseComponentRouterOptions {
  routes: ComponentRouteRecord[] | Record<string, Component | AsyncComponentLoader>
  base?: string // query/hash key e.g. ?fp=/packages/123 or #fp=/packages/123
  mode?: ComponentRouterMode
  initial?: string
  provideKey?: string // injection key for optional nested usage, defaults to 'component-router'
  debug?: boolean
}

type RouterHooks = {
  navigated: (data: { path: string, params: Record<string, string> }) => void
}

type RouterContext = {
  route: ShallowRef<{
    path: string
    params: Record<string, string>
    query: Record<string, string | string[]>
  }>
  push: (path: string) => Promise<void>
  replace: (path: string) => Promise<void>
  // Helpers bound to current router config
  makePath: (patternOrPath: string, params?: Record<string, string | number | boolean>) => string
  makeHref: (patternOrPath: string, params?: Record<string, string | number | boolean>) => string
  pushTo: (patternOrPath: string, params?: Record<string, string | number | boolean>) => Promise<void>
  replaceTo: (patternOrPath: string, params?: Record<string, string | number | boolean>) => Promise<void>
  // Navigation hooks
  hooks: ReturnType<typeof createHooks<RouterHooks>>
}

export function useComponentRouter(): RouterContext & { component?: Component }
export function useComponentRouter(
  opts: UseComponentRouterOptions,
): RouterContext & { component: Component }
export function useComponentRouter(
  opts?: UseComponentRouterOptions,
): RouterContext & { component?: Component } {
  const CTX_KEY = 'component-router'
  // Consumer mode: if no routes provided, try inject an existing router context
  if (!opts || !('routes' in opts) || !opts.routes) {
    const key = (opts && 'provideKey' in opts ? opts.provideKey : undefined) ?? CTX_KEY
    const ctx = inject<RouterContext | null>(key, null)
    if (!ctx) {
      console.warn(
        '[useComponentRouter] No parent router context found. Ensure a parent uses useComponentRouter with routes or wrap children in <component-router>.',
      )
      const emptyRoute = shallowRef<{
        path: string
        params: Record<string, string>
        query: Record<string, string | string[]>
      }>({ path: '', params: {}, query: {} })
      const warnNav = async (_p: string) =>
        console.warn(
          '[useComponentRouter] push/replace called without a parent router context.',
        )
      const noopMake = (p: string, _params?: Record<string, string | number | boolean>) => p
      const noopHref = (p: string, _params?: Record<string, string | number | boolean>) => p
      const emptyHooks = createHooks<RouterHooks>()
      return {
        route: emptyRoute,
        push: warnNav,
        replace: warnNav,
        makePath: noopMake,
        makeHref: noopHref,
        pushTo: async (p: string, _params?: Record<string, string | number | boolean>) => warnNav(p),
        replaceTo: async (p: string, _params?: Record<string, string | number | boolean>) => warnNav(p),
        hooks: emptyHooks,
        component: undefined,
      }
    }
    // consumer mode returns injected context
    return ctx as RouterContext & { component?: Component }
  }

  // Provider mode
  const props = {
    routes: Array.isArray(opts.routes)
      ? opts.routes
      : Object.entries(opts.routes || {}).map(([path, component]) => ({
          path,
          component,
        })),
    base: opts.base ?? 'fp',
    mode: opts.mode ?? 'query',
    initial: opts.initial,
    provideKey: opts.provideKey ?? CTX_KEY,
    debug: opts.debug === true,
  }

  const nuxtRoute = useRoute()
  const nuxtRouter = useRouter()

  const component = shallowRef<Component | AsyncComponentLoader | null>(null)
  const route = shallowRef<{
    path: string
    params: Record<string, string>
    query: Record<string, string | string[]>
  }>({
    path: '',
    params: {},
    query: {},
  })

  const hooks = createHooks<RouterHooks>()

  const dbg = (...args: unknown[]) => {
    if (props.debug) console.info('[component-router]', ...args)
  }

  function isAsyncComponentLoader(comp: unknown): comp is AsyncComponentLoader {
    return typeof comp === 'function' && !('__vccOpts' in comp) && !('_asyncResolved' in comp)
  }

  function normalizeComponent(comp: Component | AsyncComponentLoader): Component {
    // If it's an async loader function, wrap it with defineAsyncComponent
    if (isAsyncComponentLoader(comp)) {
      return defineAsyncComponent(() => {
        const result = comp()
        // Handle both Promise<Component> and Promise<{ default: Component }>
        return Promise.resolve(result).then((m) => {
          if (typeof m === 'object' && m !== null && 'default' in m) {
            return m.default as Component
          }
          return m as Component
        })
      })
    }
    // If it's already a component, return as-is
    return comp as Component
  }

  // Escape regex specials in static text (do not include slash; RegExp constructor doesn't need escaping it)
  function esc(text: string) {
    return text.replace(/([.+*?=^!${}()[\]|\\])/g, '\\$1')
  }

  // Compile route patterns like '/packages/:id' -> '^/packages/([^/]+)$'
  function compilePattern(path: string) {
    const keys: string[] = []
    const dyn = /\/:([^/]+)/g
    let last = 0
    let pattern = ''
    let m: RegExpExecArray | null
    while ((m = dyn.exec(path))) {
      pattern += esc(path.slice(last, m.index))
      keys.push(m[1] as string)
      pattern += '/([^/]+)'
      last = m.index + m[0].length
    }
    pattern += esc(path.slice(last))
    const regex = new RegExp('^' + pattern + '$')
    dbg('compiled', { path, pattern, regex, keys })
    return { regex, keys }
  }

  const records = computed(() =>
    props.routes.map((r) => {
      const { regex, keys } = compilePattern(r.path)
      return { ...r, regex, keys }
    }),
  )

  function matchPath(path: string) {
    dbg('matchPath', path)
    for (const r of records.value as Array<
      ComponentRouteRecord & { regex: RegExp, keys: string[] }
    >) {
      const m = r.regex.exec(path)
      dbg(' try', r.path, r.regex, !!m)
      if (m) {
        const params: Record<string, string> = {}
        r.keys.forEach(
          (k, i) => (params[k] = decodeURIComponent(m[i + 1] || '')),
        )
        return { record: r, params }
      }
    }
    return null
  }

  function setCurrent(path: string) {
    dbg('setCurrent', path)
    const m = matchPath(path) || matchPath(props.routes[0]?.path || '/')
    if (!m) return
    const rawComponent = (m.record as ComponentRouteRecord).component
    component.value = normalizeComponent(rawComponent)

    // Parse query params from the path if any (e.g., /path?foo=bar)
    const [pathOnly, queryString] = path.split('?')
    const queryParams: Record<string, string | string[]> = {}
    if (queryString) {
      const params = new URLSearchParams(queryString)
      params.forEach((value, key) => {
        queryParams[key] = value
      })
    }

    route.value = {
      path: pathOnly || path,
      params: m.params,
      query: queryParams, // Only use query params from the current path, not from nuxtRoute
    }
    dbg('current', route.value)

    // Call navigation hook for subscribers
    dbg('calling navigated hook with', { path: pathOnly || path, params: m.params })
    hooks.callHook('navigated', { path: pathOnly || path, params: m.params })
  }

  function readFromHost(): string | null {
    if (props.mode === 'query') {
      const p = nuxtRoute.query[props.base]
      dbg('readFromHost(query)', p)
      return typeof p === 'string' ? p : null
    }
    if (props.mode === 'hash') {
      const h
        = (typeof window !== 'undefined' ? window.location.hash : '') || ''
      const key = `#${props.base}=`
      const idx = h.indexOf(key)
      dbg('readFromHost(hash)', h)
      return idx >= 0 ? h.slice(idx + key.length) : null
    }
    return null // memory mode handled in push/initialize
  }

  async function writeToHost(path: string, replace = false) {
    dbg('writeToHost', path, { replace, mode: props.mode })
    const prevPath = route.value.path
    dbg('current path before write:', prevPath, 'new path:', path)
    if (props.mode === 'query') {
      // Split path into path and query parts
      const [pathOnly, queryString] = path.split('?')
      const pathQuery: Record<string, string | string[]> = {}
      if (queryString) {
        const params = new URLSearchParams(queryString)
        params.forEach((value, key) => {
          pathQuery[key] = value
        })
      }

      // Only keep the component router base param and any query params from the path itself
      const nextQuery = { [props.base]: pathOnly, ...pathQuery }

      if (nuxtRoute.query[props.base] === pathOnly && !queryString) {
        setCurrent(path)
        return
      }
      await (replace
        ? nuxtRouter.replace({ query: nextQuery })
        : nuxtRouter.push({ query: nextQuery }))
      return
    }
    if (props.mode === 'hash' && typeof window !== 'undefined') {
      const key = `#${props.base}=`
      const nextHash = key + path
      if (window.location.hash !== nextHash) {
        if (replace) {
          const url = window.location.href.replace(/#.*/, '') + nextHash
          window.history.replaceState(null, '', url)
        }
        else {
          window.location.hash = nextHash
        }
      }
      setCurrent(path)
      return
    }
    // memory mode: just set current
    setCurrent(path)
  }

  async function push(path: string) {
    await writeToHost(path, false)
  }
  async function replace(path: string) {
    await writeToHost(path, true)
  }

  // --- Generic path/href builders aware of router config ---
  function makePath(patternOrPath: string, params?: Record<string, string | number | boolean>): string {
    const hasDyn = /:[^/]+/.test(patternOrPath)
    if (!hasDyn) return patternOrPath
    const replaced = patternOrPath.replace(/:([^/]+)/g, (_m, key) => {
      const v = params?.[key]
      // Replace just the token, don't prepend a slash (the pattern already contains it)
      return encodeURIComponent(v == null ? '' : String(v))
    })
    // Normalize any accidental duplicate slashes (e.g., missing param -> '')
    return replaced.replace(/\/{2,}/g, '/')
  }

  function makeHref(patternOrPath: string, params?: Record<string, string | number | boolean>): string {
    const path = makePath(patternOrPath, params)
    if (props.mode === 'query') return `?${props.base}=${path}`
    if (props.mode === 'hash') return `#${props.base}=${path}`
    // memory: best-effort return the path (anchors won't navigate in memory mode)
    return path
  }

  async function pushTo(patternOrPath: string, params?: Record<string, string | number | boolean>) {
    const path = makePath(patternOrPath, params)
    await push(path)
  }
  async function replaceTo(patternOrPath: string, params?: Record<string, string | number | boolean>) {
    const path = makePath(patternOrPath, params)
    await replace(path)
  }

  // Provide for nested/child consumers IMMEDIATELY so children can consume during initial render
  const exposed: RouterContext = { push, replace, route, makePath, makeHref, pushTo, replaceTo, hooks }
  provide(props.provideKey!, exposed)

  // Init and sync with host
  const initialPath
    = readFromHost() || props.initial || (props.routes[0]?.path as string) || '/'
  dbg('init', { initialPath })
  writeToHost(initialPath, true)

  // Watch host for changes
  watch(
    () => ({
      q: nuxtRoute.query[props.base],
      h: typeof window !== 'undefined' ? window.location.hash : '',
    }),
    () => {
      const path = readFromHost()
      dbg('watch change detected ->', path)
      if (path) setCurrent(path)
    },
  )

  return { component, route, push, replace, makePath, makeHref, pushTo, replaceTo, hooks }
}

export default useComponentRouter

// Helper: create routes from a Vite glob import (e.g., import.meta.glob('./pages/**/*.vue'))
export function createComponentRoutes(
  glob: Record<string, AsyncComponentLoader>,
  options?: { base?: string },
): ComponentRouteRecord[] {
  const base = options?.base || ''

  const toPath = (key: string) => {
    // strip leading ./ or / and extension
    let p = key.replace(/^\.\//, '/').replace(/\.(vue|tsx?|jsx?)$/, '')
    // treat /index as root of folder
    p = p.replace(/\/index$/, '')
    // convert dynamic segments [param] -> :param
    p = p.replace(/\[(.+?)\]/g, ':$1')
    if (!p.startsWith('/')) p = '/' + p
    if (base) {
      const b = base.startsWith('/') ? base : '/' + base
      p = (b + (p === '/' ? '' : p)).replace(/\/+/, '/')
    }
    return p || '/'
  }

  return Object.entries(glob).map(([key, loader]) => ({
    path: toPath(key),
    component: loader, // Pass loader directly, normalizeComponent handles it
  }))
}
