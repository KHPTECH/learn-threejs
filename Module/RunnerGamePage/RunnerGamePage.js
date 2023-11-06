import { useRunnerGame } from './hooks'

export const RunnerGamePage = () => {

  const { mountRef } = useRunnerGame()
  return (

    <div className="canvas">
      <div ref={mountRef} className="webgl">

      </div>
    </div>
  )
}
