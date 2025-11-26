import './Menu.css';

const Menu = ({ onStart }) => {
  return (
    <div className="menu-container">
      <div className="menu-content">
        <div className="game-logo">
          <h1 className="game-title">
            <span className="title-shadow">Shadow Quest</span>
            Shadow Quest
          </h1>
          <p className="game-subtitle">The Ultimate Adventure</p>
        </div>
        
        <div className="menu-features">
          <div className="feature">
            <span className="feature-icon">⚔️</span>
            <span>Collect powerful weapons</span>
          </div>
          <div className="feature">
            <span className="feature-icon">👹</span>
            <span>Battle fierce monsters</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🏰</span>
            <span>Explore 5 unique worlds</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🐉</span>
            <span>Defeat the Dragon Boss</span>
          </div>
        </div>
        
        <button className="start-button" onClick={onStart}>
          <span className="button-text">START GAME</span>
          <span className="button-icon">▶</span>
        </button>
        
        <div className="controls-preview">
          <h3>Controls</h3>
          <div className="control-grid">
            <div className="control">
              <kbd>A</kbd><kbd>D</kbd> or <kbd>←</kbd><kbd>→</kbd>
              <span>Move</span>
            </div>
            <div className="control">
              <kbd>W</kbd> or <kbd>Space</kbd>
              <span>Jump (2x)</span>
            </div>
            <div className="control">
              <kbd>J</kbd> or <kbd>Z</kbd>
              <span>Attack</span>
            </div>
            <div className="control">
              <kbd>Shift</kbd>
              <span>Dash</span>
            </div>
            <div className="control">
              <kbd>Q</kbd>
              <span>Switch Weapon</span>
            </div>
            <div className="control">
              <kbd>Esc</kbd>
              <span>Pause</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="menu-background">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
    </div>
  );
};

export default Menu;
