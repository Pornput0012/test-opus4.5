import './GameUI.css';

const GameUI = ({ playerStats, currentLevel, levelData }) => {
  const healthPercent = (playerStats.health / playerStats.maxHealth) * 100;
  
  return (
    <div className="game-ui">
      <div className="ui-section level-info">
        <span className="level-badge">Level {currentLevel}</span>
        {levelData && <span className="level-name">{levelData.name}</span>}
      </div>
      
      <div className="ui-section health-section">
        <div className="health-label">
          <span className="health-icon">❤️</span>
          <span>HP</span>
        </div>
        <div className="health-bar-container">
          <div 
            className="health-bar"
            style={{ 
              width: `${healthPercent}%`,
              backgroundColor: healthPercent > 50 ? '#2ecc71' : healthPercent > 25 ? '#f1c40f' : '#e74c3c'
            }}
          />
          <span className="health-text">{playerStats.health} / {playerStats.maxHealth}</span>
        </div>
      </div>
      
      <div className="ui-section stats-section">
        <div className="stat">
          <span className="stat-icon">⭐</span>
          <span className="stat-value">{playerStats.score}</span>
        </div>
        <div className="stat">
          <span className="stat-icon">💰</span>
          <span className="stat-value">{playerStats.coins}</span>
        </div>
      </div>
      
      {playerStats.currentWeapon && (
        <div className="ui-section weapon-section">
          <div className="weapon-label">Weapon</div>
          <div className="weapon-info">
            <span className="weapon-name">{playerStats.currentWeapon.name}</span>
            <span className="weapon-damage">DMG: {playerStats.currentWeapon.damage}</span>
          </div>
          {playerStats.weapons.length > 1 && (
            <div className="weapon-switch-hint">Press Q to switch</div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameUI;
