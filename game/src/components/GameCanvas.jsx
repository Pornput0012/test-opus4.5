import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/constants';
import './GameCanvas.css';

const GameCanvas = ({ canvasRef }) => {
  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="game-canvas"
    />
  );
};

export default GameCanvas;
