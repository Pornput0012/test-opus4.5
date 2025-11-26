import useGameEngine from './hooks/useGameEngine'
import GameCanvas from './components/GameCanvas'
import GameUI from './components/GameUI'
import GameOverlay from './components/GameOverlay'
import Menu from './components/Menu'
import './App.css'

function App() {
  const {
    canvasRef,
    gameState,
    playerStats,
    currentLevel,
    levelData,
    startGame,
    restartGame,
    resumeGame,
    nextLevel,
    totalLevels
  } = useGameEngine();

  if (gameState === 'menu') {
    return <Menu onStart={startGame} />;
  }

  return (
    <div className="game-container">
      <GameUI 
        playerStats={playerStats} 
        currentLevel={currentLevel}
        levelData={levelData}
      />
      
      <div className="canvas-container">
        <GameCanvas canvasRef={canvasRef} />
        
        {gameState === 'paused' && (
          <GameOverlay 
            type="paused"
            playerStats={playerStats}
            currentLevel={currentLevel}
            onResume={resumeGame}
            onRestart={restartGame}
          />
        )}
        
        {gameState === 'gameover' && (
          <GameOverlay 
            type="gameover"
            playerStats={playerStats}
            currentLevel={currentLevel}
            onRestart={restartGame}
          />
        )}
        
        {gameState === 'levelComplete' && (
          <GameOverlay 
            type="levelComplete"
            playerStats={playerStats}
            currentLevel={currentLevel}
            totalLevels={totalLevels}
            onNextLevel={nextLevel}
          />
        )}
        
        {gameState === 'victory' && (
          <GameOverlay 
            type="victory"
            playerStats={playerStats}
            currentLevel={currentLevel}
            totalLevels={totalLevels}
            onRestart={restartGame}
          />
        )}
      </div>
      
      <div className="controls-info">
        <span><kbd>A/D</kbd> Move</span>
        <span><kbd>Space/W</kbd> Jump</span>
        <span><kbd>J/Z</kbd> Attack</span>
        <span><kbd>Shift</kbd> Dash</span>
        <span><kbd>Q</kbd> Switch Weapon</span>
        <span><kbd>ESC</kbd> Pause</span>
      </div>
    </div>
  )
}

export default App
