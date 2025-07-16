import React, { useState } from 'react';
import { useAuth } from '../content/authContent';

const DevCheatPanel = ({ 
  onAddCoins, 
  onUnlockAllPets, 
  onResetBattle, 
  onForceEnvironment,
  onSetCreatureTier 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coinAmount, setCoinAmount] = useState(10000);

  const cheatActions = [
    {
      name: 'Add Coins',
      action: () => onAddCoins(coinAmount),
      color: '#ffd700',
      icon: '💰'
    },
    {
      name: 'Unlock All Pets',
      action: onUnlockAllPets,
      color: '#4ecdc4',
      icon: '🔓'
    },
    {
      name: 'Reset Battle',
      action: onResetBattle,
      color: '#ff6b6b',
      icon: '🔄'
    },
    {
      name: 'Force Fire Environment',
      action: () => onForceEnvironment('fire_dominant'),
      color: '#ff4500',
      icon: '🔥'
    },
    {
      name: 'Force Ice Environment', 
      action: () => onForceEnvironment('ice_dominant'),
      color: '#87ceeb',
      icon: '❄️'
    },
    {
      name: 'Upgrade to Dissonant',
      action: () => onSetCreatureTier('Dissonant'),
      color: '#8b4513',
      icon: '⚡'
    }
  ];

  return (
    <>
      <style jsx>{`
        .dev-panel-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          background: #ff1744;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 4px 15px rgba(255, 23, 68, 0.4);
          transition: all 0.3s ease;
        }

        .dev-panel-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 23, 68, 0.6);
        }

        .dev-panel {
          position: fixed;
          top: 70px;
          right: 20px;
          z-index: 9998;
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #ff1744;
          border-radius: 15px;
          padding: 20px;
          min-width: 300px;
          backdrop-filter: blur(10px);
          transform: ${isOpen ? 'translateX(0)' : 'translateX(100%)'};
          transition: transform 0.3s ease;
        }

        .dev-panel h3 {
          color: #ff1744;
          text-align: center;
          margin-bottom: 20px;
          font-size: 1.2rem;
        }

        .coin-input-section {
          margin-bottom: 20px;
          padding: 15px;
          background: rgba(255, 215, 0, 0.1);
          border-radius: 10px;
          border: 1px solid #ffd700;
        }

        .coin-input-label {
          color: #ffd700;
          font-weight: bold;
          margin-bottom: 10px;
          display: block;
        }

        .coin-input {
          width: 100%;
          padding: 8px 12px;
          border: 2px solid #ffd700;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          font-size: 1rem;
          text-align: center;
        }

        .cheat-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .cheat-button {
          background: linear-gradient(45deg, var(--btn-color), var(--btn-color-dark));
          border: none;
          color: white;
          padding: 12px 15px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .cheat-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
        }

        .warning-text {
          color: #ff6b6b;
          font-size: 0.8rem;
          text-align: center;
          margin-top: 15px;
          font-style: italic;
        }

        .preset-amounts {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .preset-btn {
          background: rgba(255, 215, 0, 0.2);
          border: 1px solid #ffd700;
          color: #ffd700;
          padding: 4px 8px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s ease;
        }

        .preset-btn:hover {
          background: rgba(255, 215, 0, 0.4);
        }
      `}</style>

      <button 
        className="dev-panel-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        🛠️ DEV
      </button>

      <div className="dev-panel">
        <h3>🚀 Developer Cheat Panel</h3>
        
        <div className="coin-input-section">
          <label className="coin-input-label">💰 Coin Amount:</label>
          <input
            type="number"
            className="coin-input"
            value={coinAmount}
            onChange={(e) => setCoinAmount(Number(e.target.value))}
            placeholder="Enter coin amount"
          />
          <div className="preset-amounts">
            <button className="preset-btn" onClick={() => setCoinAmount(1000)}>1K</button>
            <button className="preset-btn" onClick={() => setCoinAmount(10000)}>10K</button>
            <button className="preset-btn" onClick={() => setCoinAmount(50000)}>50K</button>
            <button className="preset-btn" onClick={() => setCoinAmount(999999)}>MAX</button>
          </div>
        </div>

        <div className="cheat-actions">
          {cheatActions.map((action, index) => (
            <button
              key={index}
              className="cheat-button"
              onClick={action.action}
              style={{
                '--btn-color': action.color,
                '--btn-color-dark': action.color + '88'
              }}
            >
              <span>{action.icon}</span>
              <span>{action.name}</span>
            </button>
          ))}
        </div>

        <div className="warning-text">
          ⚠️ Development tools only - use responsibly!
        </div>
      </div>
    </>
  );
};

// Usage in your BattleArenaEnhanced component:
export const useDevCheats = () => {
  const { token } = useAuth(); // Your auth context

  const addCoins = async (amount) => {
    try {
      const response = await fetch('https://backendmern-ugqz.onrender.com/api/auth/dev/add-coins', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      });
      
      if (response.ok) {
        console.log(`✅ Added ${amount} coins!`);
        // Trigger UI refresh
      }
    } catch (error) {
      console.error('❌ Failed to add coins:', error);
    }
  };

  const unlockAllPets = async () => {
    try {
      const response = await fetch('https://backendmern-ugqz.onrender.com/api/auth/dev/unlock-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('✅ Unlocked all pets!');
        // Trigger collection refresh
      }
    } catch (error) {
      console.error('❌ Failed to unlock pets:', error);
    }
  };

  const resetBattle = () => {
    // Remove stuck elements
    document.querySelectorAll('.damage-number, .battle-particle, .attack-projectile').forEach(el => {
      if (el.parentNode) el.remove();
    });
    
    // Reset battle state
    console.log('✅ Battle reset complete!');
  };

  const forceEnvironment = (envType) => {
    // Force environment change
    console.log(`🌍 Forcing environment to: ${envType}`);
    // Your environment change logic here
  };

  const setCreatureTier = (tier) => {
    console.log(`⚡ Setting creature tier to: ${tier}`);
    // Temporarily upgrade creatures for testing
  };

  return {
    addCoins,
    unlockAllPets,
    resetBattle,
    forceEnvironment,
    setCreatureTier
  };
};

export default DevCheatPanel;