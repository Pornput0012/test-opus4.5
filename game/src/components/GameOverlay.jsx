import './GameOverlay.css';

const GameOverlay = ({ 
  type, 
  playerStats, 
  currentLevel, 
  totalLevels,
  onRestart, 
  onResume, 
  onNextLevel 
}) => {
  const renderPausedContent = () => (
    <>
      <h2 className="overlay-title">⏸️ PAUSED</h2>
      <div className="overlay-buttons">
        <button className="overlay-button resume" onClick={onResume}>
          ▶ Resume
        </button>
        <button className="overlay-button restart" onClick={onRestart}>
          🔄 Restart Game
        </button>
      </div>
      <p className="overlay-hint">Press ESC to resume</p>
    </>
  );

  const renderGameOverContent = () => (
    <>
      <h2 className="overlay-title game-over">💀 GAME OVER</h2>
      <div className="overlay-stats">
        <div className="stat-row">
          <span>Level Reached:</span>
          <span>{currentLevel}</span>
        </div>
        <div className="stat-row">
          <span>Final Score:</span>
          <span className="highlight">{playerStats.score}</span>
        </div>
        <div className="stat-row">
          <span>Coins Collected:</span>
          <span>{playerStats.coins}</span>
        </div>
        <div className="stat-row">
          <span>Weapons Found:</span>
          <span>{playerStats.weapons.length}</span>
        </div>
      </div>
      <div className="overlay-buttons">
        <button className="overlay-button restart" onClick={onRestart}>
          🔄 Try Again
        </button>
      </div>
    </>
  );

  const renderLevelCompleteContent = () => (
    <>
      <h2 className="overlay-title level-complete">🎉 LEVEL COMPLETE!</h2>
      <div className="level-progress">
        <span className="level-from">Level {currentLevel}</span>
        <span className="arrow">→</span>
        <span className="level-to">Level {currentLevel + 1}</span>
      </div>
      <div className="overlay-stats">
        <div className="stat-row">
          <span>Score:</span>
          <span className="highlight">{playerStats.score}</span>
        </div>
        <div className="stat-row">
          <span>Coins:</span>
          <span>{playerStats.coins}</span>
        </div>
        <div className="stat-row">
          <span>Health:</span>
          <span>{playerStats.health} / {playerStats.maxHealth}</span>
        </div>
      </div>
      <div className="overlay-buttons">
        <button className="overlay-button next-level" onClick={onNextLevel}>
          ➡️ Next Level
        </button>
      </div>
    </>
  );

  const renderVictoryContent = () => (
    <>
      <h2 className="overlay-title victory">🏆 VICTORY!</h2>
      <p className="victory-message">You have defeated the Dragon and saved the realm!</p>
      <div className="trophy-animation">👑</div>
      <div className="overlay-stats">
        <div className="stat-row big">
          <span>Final Score:</span>
          <span className="highlight gold">{playerStats.score}</span>
        </div>
        <div className="stat-row">
          <span>Total Coins:</span>
          <span>{playerStats.coins}</span>
        </div>
        <div className="stat-row">
          <span>Weapons Collected:</span>
          <span>{playerStats.weapons.length}</span>
        </div>
        <div className="stat-row">
          <span>Levels Completed:</span>
          <span>{totalLevels} / {totalLevels}</span>
        </div>
      </div>
      <div className="overlay-buttons">
        <button className="overlay-button play-again" onClick={onRestart}>
          🔄 Play Again
        </button>
      </div>
    </>
  );

  const getContent = () => {
    switch (type) {
      case 'paused':
        return renderPausedContent();
      case 'gameover':
        return renderGameOverContent();
      case 'levelComplete':
        return renderLevelCompleteContent();
      case 'victory':
        return renderVictoryContent();
      default:
        return null;
    }
  };

  return (
    <div className={`game-overlay ${type}`}>
      <div className="overlay-content">
        {getContent()}
      </div>
    </div>
  );
};

export default GameOverlay;
