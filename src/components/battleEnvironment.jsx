import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

  const BattleEnvironment = () => {
  const [currentEnvironment, setCurrentEnvironment] = useState('neutral');
  const [battlePhase, setBattlePhase] = useState('idle'); // idle, charging, attacking, shifting
  const [environmentAdvantage, setEnvironmentAdvantage] = useState(null);
  
  // Refs for environment layers
  const bgLayer1Ref = useRef(null);
  const bgLayer2Ref = useRef(null);
  const bgLayer3Ref = useRef(null);
  const overlayRef = useRef(null);
  const battlefieldRef = useRef(null);
  
  // Sample creatures for demo
  const [creature1] = useState({
    name: 'Flame Warlord',
    type: 'Fire',
    tier: 'Dissonant',
    hp: 100,
    currentHp: 100
  });
  
  const [creature2] = useState({
    name: 'Storm Bear', 
    type: 'Water',
    tier: 'Dissonant',
    hp: 100,
    currentHp: 85
  });

  // Environment configurations
  const environments = {
    neutral: {
      name: 'Ancient Ruins',
      colors: ['#2a2a3e', '#3a3a5e', '#4a4a6e'],
      effects: 'none',
      advantage: null
    },
    fire_dominant: {
      name: 'Volcanic Forge',
      colors: ['#1a0a0a', '#4a1a0a', '#8a3a0a', '#ff6b00'],
      effects: 'ember-particles',
      advantage: 'Fire'
    },
    ice_dominant: {
      name: 'Frozen Wasteland', 
      colors: ['#0a1a2a', '#1a3a5a', '#3a5a8a', '#87ceeb'],
      effects: 'snow-particles',
      advantage: 'Water'
    },
    storm_dominant: {
      name: 'Lightning Peaks',
      colors: ['#1a1a0a', '#3a3a1a', '#5a5a3a', '#ffff00'],
      effects: 'lightning-flashes',
      advantage: 'Air'
    },
    earth_dominant: {
      name: 'Crystal Caverns',
      colors: ['#0a2a1a', '#1a4a2a', '#2a6a3a', '#228b22'],
      effects: 'earth-tremor',
      advantage: 'Earth'
    }
  };

  // Environment shift animation
  const shiftEnvironment = async (newEnv) => {
    if (newEnv === currentEnvironment) return;
    
    setBattlePhase('shifting');
    
    const timeline = gsap.timeline({
      onComplete: () => {
        setCurrentEnvironment(newEnv);
        setEnvironmentAdvantage(environments[newEnv].advantage);
        setBattlePhase('idle');
      }
    });

    // Parallax movement simulation
    timeline
      .to([bgLayer1Ref.current, bgLayer2Ref.current, bgLayer3Ref.current], {
        x: -200,
        duration: 2,
        ease: "power2.inOut"
      })
      .to(overlayRef.current, {
        opacity: 1,
        duration: 0.5
      }, 0.5)
      .to(overlayRef.current, {
        background: `linear-gradient(135deg, ${environments[newEnv].colors.join(', ')})`,
        duration: 1
      }, 1)
      .to([bgLayer1Ref.current, bgLayer2Ref.current, bgLayer3Ref.current], {
        x: 0,
        duration: 1.5,
        ease: "power2.out"
      }, 1.5)
      .to(overlayRef.current, {
        opacity: 0.3,
        duration: 0.5
      }, 2.5);
  };

  // Simulate epic battle sequence
  const executeEpicBattle = async () => {
    setBattlePhase('charging');
    
    // Phase 1: Creature 1 charges fire attack
    await gsap.to('.creature1-card', {
      scale: 1.1,
      filter: 'brightness(1.5) drop-shadow(0 0 20px #ff6b00)',
      duration: 1,
      ease: "power2.out"
    });

    setBattlePhase('attacking');
    
    // Phase 2: Fire attack launches
    const fireball = document.createElement('div');
    fireball.className = 'attack-projectile fireball';
    fireball.innerHTML = '🔥';
    battlefieldRef.current.appendChild(fireball);
    
    gsap.set(fireball, {
      position: 'absolute',
      left: '20%',
      top: '50%',
      fontSize: '60px',
      zIndex: 1000
    });
    
    // Fireball trajectory toward creature 2
    await gsap.to(fireball, {
      left: '70%',
      rotation: 360,
      duration: 1,
      ease: "power2.out"
    });

    // Phase 3: Ice shield defense + counter
    const shield = document.createElement('div');
    shield.className = 'defense-shield';
    shield.innerHTML = '🛡️❄️';
    battlefieldRef.current.appendChild(shield);
    
    gsap.set(shield, {
      position: 'absolute',
      left: '65%',
      top: '45%',
      fontSize: '80px',
      zIndex: 1001
    });

    // Shield blocks fireball
    await gsap.to(shield, {
      scale: 1.5,
      duration: 0.3
    });

    // Remove fireball and shield
    fireball.remove();
    shield.remove();

    // Phase 4: Creature 2 charges ice storm counter
    await gsap.to('.creature2-card', {
      borderColor: '#87ceeb',
      filter: 'brightness(1.5) drop-shadow(0 0 25px #87ceeb)',
      duration: 0.8
    });

    // Phase 5: Storm formation and attack
    await createStormAttack();
    
    // Phase 6: Environment shifts to ice dominant
    await shiftEnvironment('ice_dominant');
    
    // Reset creature cards
    gsap.to(['.creature1-card', '.creature2-card'], {
      scale: 1,
      filter: 'brightness(1)',
      borderColor: '#444',
      duration: 1
    });
  };

  const createStormAttack = async () => {
    // Create storm particles
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.innerHTML = ['❄️', '⚡', '🌨️'][Math.floor(Math.random() * 3)];
      particle.style.cssText = `
        position: absolute;
        left: ${60 + Math.random() * 20}%;
        top: ${30 + Math.random() * 40}%;
        font-size: ${20 + Math.random() * 20}px;
        pointer-events: none;
        z-index: 999;
      `;
      battlefieldRef.current.appendChild(particle);
      
      // Swirling motion
      gsap.to(particle, {
        rotation: 360,
        scale: 0,
        duration: 2,
        ease: "power2.out",
        onComplete: () => particle.remove()
      });
    }

    // Lightning flash effect
    const lightning = document.createElement('div');
    lightning.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 0, 0.3);
      pointer-events: none;
      z-index: 998;
    `;
    battlefieldRef.current.appendChild(lightning);
    
    await gsap.fromTo(lightning, 
      { opacity: 0 },
      { 
        opacity: 1,
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        onComplete: () => lightning.remove()
      }
    );

    // Storm funnel attack
    const funnel = document.createElement('div');
    funnel.innerHTML = '🌪️❄️⚡';
    funnel.style.cssText = `
      position: absolute;
      left: 70%;
      top: 50%;
      font-size: 70px;
      z-index: 1000;
    `;
    battlefieldRef.current.appendChild(funnel);
    
    await gsap.to(funnel, {
      left: '20%',
      scale: 1.5,
      rotation: 720,
      duration: 1.2,
      ease: "power3.out",
      onComplete: () => funnel.remove()
    });
  };

  const resetBattle = () => {
    setCurrentEnvironment('neutral');
    setEnvironmentAdvantage(null);
    setBattlePhase('idle');
    
    // Reset all animations
    gsap.set([bgLayer1Ref.current, bgLayer2Ref.current, bgLayer3Ref.current], {
      x: 0
    });
    gsap.set(overlayRef.current, {
      opacity: 0.3,
      background: 'linear-gradient(135deg, #2a2a3e, #3a3a5e, #4a4a6e)'
    });
  };

  return (
    <div className="epic-battle-container">
      <style jsx>{`
        .epic-battle-container {
          width: 100%;
          height: 100vh;
          background: #0a0a0a;
          overflow: hidden;
          position: relative;
        }

        .battlefield {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .background-layer {
          position: absolute;
          width: 120%;
          height: 120%;
          opacity: 0.8;
        }

        .bg-layer-1 {
          background: linear-gradient(45deg, #1a1a2e, #16213e);
          z-index: 1;
        }

        .bg-layer-2 {
          background: linear-gradient(135deg, #0f3460, #533483);
          z-index: 2;
          opacity: 0.6;
        }

        .bg-layer-3 {
          background: radial-gradient(circle, transparent 20%, rgba(0,0,0,0.4) 80%);
          z-index: 3;
          opacity: 0.5;
        }

        .environment-overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 4;
          opacity: 0.3;
          background: linear-gradient(135deg, #2a2a3e, #3a3a5e, #4a4a6e);
          transition: all 0.5s ease;
        }

        .battle-arena {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 80%;
          max-width: 1000px;
          z-index: 10;
          position: relative;
        }

        .creature-card {
          width: 250px;
          height: 350px;
          background: linear-gradient(145deg, #1a1a2e, #16213e);
          border: 3px solid #444;
          border-radius: 20px;
          padding: 20px;
          text-align: center;
          position: relative;
          transition: all 0.3s ease;
        }

        .creature1-card {
          border-color: #ff6b6b;
        }

        .creature2-card {
          border-color: #4ecdc4;
        }

        .creature-image {
          width: 100%;
          height: 200px;
          background: linear-gradient(45deg, #333, #555);
          border-radius: 15px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 60px;
        }

        .creature-name {
          color: #ffd700;
          font-size: 1.4rem;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .creature-type {
          color: #ccc;
          font-size: 1rem;
          margin-bottom: 10px;
        }

        .health-bar {
          background: #333;
          height: 20px;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }

        .health-fill {
          height: 100%;
          background: linear-gradient(90deg, #4ecdc4, #44a08d);
          border-radius: 10px;
          transition: width 0.5s ease;
        }

        .health-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .vs-indicator {
          font-size: 4rem;
          color: #ffd700;
          font-weight: bold;
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        .controls {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          gap: 20px;
        }

        .epic-button {
          background: linear-gradient(45deg, #ff6b6b, #ee5a52);
          border: none;
          color: white;
          padding: 15px 30px;
          font-size: 1.1rem;
          font-weight: bold;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .epic-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
        }

        .epic-button:disabled {
          background: #666;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .environment-info {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 20;
          background: rgba(0, 0, 0, 0.8);
          padding: 15px 20px;
          border-radius: 10px;
          color: white;
        }

        .environment-name {
          font-size: 1.2rem;
          font-weight: bold;
          color: #ffd700;
          margin-bottom: 5px;
        }

        .environment-advantage {
          font-size: 1rem;
          color: #4ecdc4;
        }

        .battle-phase {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 20;
          background: rgba(255, 215, 0, 0.9);
          color: #000;
          padding: 10px 20px;
          border-radius: 20px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .environment-buttons {
          position: absolute;
          top: 100px;
          right: 20px;
          z-index: 20;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .env-button {
          background: rgba(0, 0, 0, 0.7);
          border: 2px solid #444;
          color: white;
          padding: 8px 15px;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .env-button:hover {
          border-color: #ffd700;
          background: rgba(255, 215, 0, 0.2);
        }

        .env-button.active {
          border-color: #4ecdc4;
          background: rgba(78, 205, 196, 0.3);
        }
      `}</style>

      <div className="battlefield" ref={battlefieldRef}>
        {/* Background Layers for Parallax */}
        <div 
          ref={bgLayer1Ref}
          className="background-layer bg-layer-1"
        />
        <div 
          ref={bgLayer2Ref}
          className="background-layer bg-layer-2"
        />
        <div 
          ref={bgLayer3Ref}
          className="background-layer bg-layer-3"
        />
        <div 
          ref={overlayRef}
          className="environment-overlay"
        />

        {/* Battle Arena */}
        <div className="battle-arena">
          {/* Creature 1 */}
          <div className="creature-card creature1-card">
            <div className="creature-image">
              🔥🦁
            </div>
            <div className="creature-name">{creature1.name}</div>
            <div className="creature-type">{creature1.type} • {creature1.tier}</div>
            <div className="health-bar">
              <div 
                className="health-fill" 
                style={{ width: `${(creature1.currentHp / creature1.hp) * 100}%` }}
              />
              <div className="health-text">
                {creature1.currentHp}/{creature1.hp}
              </div>
            </div>
          </div>

          {/* VS Indicator */}
          <div className="vs-indicator">
            {battlePhase === 'idle' ? 'VS' : 
             battlePhase === 'shifting' ? '🌪️' : '⚔️'}
          </div>

          {/* Creature 2 */}
          <div className="creature-card creature2-card">
            <div className="creature-image">
              ❄️🐻
            </div>
            <div className="creature-name">{creature2.name}</div>
            <div className="creature-type">{creature2.type} • {creature2.tier}</div>
            <div className="health-bar">
              <div 
                className="health-fill" 
                style={{ width: `${(creature2.currentHp / creature2.hp) * 100}%` }}
              />
              <div className="health-text">
                {creature2.currentHp}/{creature2.hp}
              </div>
            </div>
          </div>
        </div>

        {/* Environment Info */}
        <div className="environment-info">
          <div className="environment-name">
            {environments[currentEnvironment].name}
          </div>
          {environmentAdvantage && (
            <div className="environment-advantage">
              {environmentAdvantage} Advantage Active
            </div>
          )}
        </div>

        {/* Battle Phase Indicator */}
        <div className="battle-phase">
          {battlePhase.replace('_', ' ')}
        </div>

        {/* Environment Quick Switch (for demo) */}
        <div className="environment-buttons">
          {Object.keys(environments).map(env => (
            <button
              key={env}
              className={`env-button ${currentEnvironment === env ? 'active' : ''}`}
              onClick={() => shiftEnvironment(env)}
            >
              {environments[env].name}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="controls">
          <button 
            className="epic-button"
            onClick={executeEpicBattle}
            disabled={battlePhase !== 'idle'}
          >
            {battlePhase === 'idle' ? 'Execute Epic Battle' : 'Battle in Progress...'}
          </button>
          <button 
            className="epic-button"
            onClick={resetBattle}
            style={{ background: 'linear-gradient(45deg, #4ecdc4, #44a08d)' }}
          >
            Reset Arena
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattleEnvironment;