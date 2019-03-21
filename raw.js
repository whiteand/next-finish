
export default function middleware(...fsOrConditional) {
  const fs = fsOrConditional.map((f, ind) => {
    if (typeof f === 'function') return f

    if (Array.isArray(f) && f.length === 2) {
      const [cond, handler] = f
      return (n, f, ...args) => {
        if (cond(...args)) {
          f(handler(...args))
        }
        n(...args)
      }
    }

    throw new TypeError('middleware takes only functions or [cond, handler], but ' + i + '-th parameter is not a function or [cond, handler]')
  })
  return (...args) => {
    for (let i = 0; i < fs.length; i += 1) {
      const currentF = fs[i];

      let isFinished = false,
          finishArgs = [],
          isNext = false,
          nextArgs = [];
      
      const finish = function(...args){
        isFinished = true
        finishArgs = args
      }
      const next = function(...args) {
        isNext = true
        nextArgs = args
      }
      currentF(next, finish, ...args)

      if (isFinished) {
        return finishArgs.length <= 1
          ? finishArgs[0]
          : finishArgs
      }

      if (isNext) {
        args = nextArgs
        continue
      }

      return undefined
    }
  }
}
