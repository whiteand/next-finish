
export default function middleware(...fs) {
  return (...args) => {
    for (let i = 0; i < fs.length; i += 1) {
      const currentF = fs[i];
      if (typeof currentF !== 'function') {
        throw new TypeError('middleware takes only functions, but ' + i + '-th parameter is not a function')
      }

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
