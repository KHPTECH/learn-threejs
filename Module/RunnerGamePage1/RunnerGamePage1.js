import { useRunnerGame1 } from './hooks'

export const RunnerGamePage1 = () => {

  const { mountRef } = useRunnerGame1()
  return (

    <div className="canvas">
      <div ref={mountRef} className="webgl">

      </div>
    </div>
  )
}
