import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../content/authContent';
import Footer from './Footer';
import { epicBattleAnimations } from './battleAnimations';
import './battleEffects.css';
import DevCheatPanel, { useDevCheats } from './DevCheatPanel';
// 🎬 EPIC BATTLE ARENA - Enhanced with advanced animations
// Uses Anime.js + GSAP for high-impact visual effects while keeping pets static
const BattleArenaEnhanced = () => {
  const { addCoins, unlockAllPets, resetBattle: devResetBattle, forceEnvironment, setCreatureTier } = useDevCheats();

  const { token } = useAuth();
  
  // 🎮 Core State Management
  const [selectedCreatures, setSelectedCreatures] = useState([]);
  const [creature1, setCreature1] = useState(null);
  const [creature2, setCreature2] = useState(null);
  const [battleActive, setBattleActive] = useState(false);
  const [battleTurnActive, setBattleTurnActive] = useState(false);
  const [battlesWon, setBattlesWon] = useState(0);
  const [gameState, setGameState] = useState('selection'); // 'selection' or 'battle'
  const [battleLog, setBattleLog] = useState([]);
  const [creatures, setCreatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🎬 Animation State Management - NEW!
  const [attackPhase, setAttackPhase] = useState('idle'); // 'idle', 'charging', 'attacking', 'impact', 'recovery'
  const [currentAttacker, setCurrentAttacker] = useState(null); // 1 or 2
  const [damageAmount, setDamageAmount] = useState(0);
  const [damageType, setDamageType] = useState('normal'); // 'normal', 'critical', 'special', 'heal', 'advantage'
  const [elementType, setElementType] = useState('normal'); // Element type for themed effects
  const [isSpecialAttack, setIsSpecialAttack] = useState(false);
  
  // Refs for DOM elements and animation control
  const battleInterval = useRef(null);
  const creature1Ref = useRef(null);
  const creature2Ref = useRef(null);
  const healthBar1Ref = useRef(null);
  const healthBar2Ref = useRef(null);
  const currentAnimations = useRef([]); // Track running animations for cleanup

  // Game constants
  const typeAdvantages = {
    Fire: { strongAgainst: ["Earth"], weakAgainst: ["Water"] },
    Water: { strongAgainst: ["Fire"], weakAgainst: ["Air"] },
    Air: { strongAgainst: ["Water"], weakAgainst: ["Earth"] },
    Earth: { strongAgainst: ["Air"], weakAgainst: ["Fire"] },
    Neutral: { strongAgainst: [], weakAgainst: [] }
  };

  // Initialize creatures from MongoDB
  useEffect(() => {
    fetchUserCreatures();
  }, [token]);

  // Battle management effect
  useEffect(() => {
    console.log('🔄 Battle state changed:', { battleActive, battleTurnActive });
    
    if (battleActive && !battleTurnActive && creature1 && creature2) {
      console.log('▶️ Starting battle sequence');
      
      // Clear any existing interval
      if (battleInterval.current) {
        clearInterval(battleInterval.current);
      }
      
      // Start the battle interval
      battleInterval.current = setInterval(() => {
        console.log('⏱️ Battle interval executing');
        executeBattleTurn();
      }, 3000);
      
      // Execute first turn immediately
      setTimeout(() => {
        console.log('🎯 Executing first battle turn');
        executeBattleTurn();
      }, 1000);
    }
    
    return () => {
      if (battleInterval.current) {
        clearInterval(battleInterval.current);
      }
    };
  }, [battleActive, creature1, creature2]);

  const fetchUserCreatures = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://backendmern-ugqz.onrender.com/api/auth/sanctum', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.sanctum && data.sanctum.collection && data.sanctum.collection.creatures) {
          // Transform the data to match battle arena format
          const transformedCreatures = data.sanctum.collection.creatures.map(creature => ({
            _id: creature.userPetId || creature.id,
            name: creature.identity.name,
            species: creature.identity.species,
            tier: creature.identity.tier,
            type: creature.identity.type,
            hp: creature.battleStats?.hp || 100,
            attack: creature.battleStats?.attack || creature.attributes?.totalPower * 0.3 || 50,
            special: creature.battleStats?.special || `${creature.identity.name} Special`,
            specialDamage: creature.battleStats?.specialDamage || creature.attributes?.totalPower * 0.5 || 70,
            heal: creature.battleStats?.heal || 0,
            speed: creature.battleStats?.speed || 50,
            rarity: creature.meta.rarity,
            // Enhanced attributes from sanctum system
            totalPower: creature.attributes.totalPower,
            aggression: creature.attributes.aggression,
            intuition: creature.attributes.intuition,
            intimidation: creature.attributes.intimidation,
            intensity: creature.attributes.intensity,
            prestigeValue: creature.meta.prestigeValue
          }));
          setCreatures(transformedCreatures);
        } else {
          setError('No creatures found in your collection');
        }
      } else {
        setError('Failed to load your creatures');
      }
    } catch (err) {
      console.error('Error fetching creatures:', err);
      setError('Network error loading creatures');
    } finally {
      setLoading(false);
    }
  };

  // Helper function for image mapping
  const getPetImage = (creature) => {
    // 🐛 DEBUG: Log creature name to help debug image loading
    console.log('🖼️ UPDATED - Getting image for creature:', creature.name);
    
    const imageMap = {
      'Flame Warlord': '/images/disChimp.png',
      'Storm Bear': '/images/disPolar.png', 
      'Forest Chimp': '/images/proChimp.png',
      'Arctic Bear': '/images/proPolar.jpeg',
      'Phoenix Lord': '/images/disEagle.jpeg',
      'Golden Tiger': '/images/proTiger.jpeg',
      'Inferno Tiger': '/images/disTiger.jpeg',
      'Celestial Flamingo': '/images/proPink.png',
      'Noble Steed': '/images/proArabian.jpeg',
      'Gentle Panda': '/images/proPanda.jpeg',
      'Royal Lion': '/images/proLion.jpeg',
      'Flame Lion': '/images/disLion.jpeg',
      'Shadow Wolf': '/images/disWolf.jpeg',
      'Wolf Pup': '/images/proWolf.jpeg',
      'Golden Eagle': '/images/proEagle.jpeg',
      'Girragon': '/images/disGirragon.jpeg',
      'Savanna Giraffe': '/images/proGiraffe.jpeg',
      'Phoenix Flamingo': '/images/disPink.jpeg',
      'Arabian Unicorn': '/images/proArabian.jpeg',
      'Cosmic Unicorn': '/images/disArabian.jpeg',
      'Fire Panda': '/images/disPanda.jpeg'
    };
    
    const imagePath = imageMap[creature.name] || '/images/placeholder.png';
    console.log('🎯 Image path for', creature.name, ':', imagePath);
    return imagePath;
  };

  const addLogEntry = (text, type = 'damage') => {
    setBattleLog(prev => [{ text, type, id: Date.now() }, ...prev.slice(0, 9)]);
    
    // Animate new log entry
    setTimeout(() => {
      const logEntries = document.querySelectorAll('.log-entry');
      const newEntry = logEntries[0];
      if (newEntry) {
      }
    }, 50);
  };

  // 💥 EPIC DAMAGE NUMBERS - Now using animation system
  const createEpicDamageNumber = (element, damage, type = 'normal') => {
    if (!element) return;
    
    // Use our epic animation system instead of basic CSS
    return epicBattleAnimations.epicFloatingDamage(element, damage, type);
  };

  // 🎆 EPIC SCREEN FLASH - Now powered by GSAP
  const createEpicScreenFlash = (color, intensity = 1) => {
    return epicBattleAnimations.epicScreenFlash(color, intensity);
  };

  const calculateDamage = (attacker, defender, isSpecial) => {
    let damage = isSpecial ? attacker.specialDamage : attacker.attack;
    
    // Dissonant tier bonus for special attacks
    if (attacker.tier === 'Dissonant' && isSpecial) {
      damage *= 1.5;
    }
    
    const attackerType = attacker.type || 'Neutral';
    const defenderType = defender.type || 'Neutral';
    const advantages = typeAdvantages[attackerType] || typeAdvantages.Neutral;
    
    if (advantages.strongAgainst.includes(defenderType)) {
      damage *= 1.5;
      return { damage: Math.floor(damage), advantage: true };
    }
    
    if (advantages.weakAgainst.includes(defenderType)) {
      damage *= 0.75;
      return { damage: Math.floor(damage), advantage: false };
    }
    
    const isCritical = Math.random() < 0.15;
    if (isCritical) {
      damage *= 1.5;
      return { damage: Math.floor(damage), critical: true };
    }
    
    damage = Math.floor(damage * (0.9 + Math.random() * 0.2));
    return { damage, critical: false };
  };

  // Battle functions
  const selectCreature = (creature) => {
    const creatureElement = document.querySelector(`[data-creature-id="${creature._id}"]`);
    
    if (selectedCreatures.length < 2 && !selectedCreatures.find(c => c._id === creature._id)) {
      setSelectedCreatures(prev => [...prev, creature]);
      
      // Selection animation
      if (creatureElement) {
        // Add selected class for CSS animation
        creatureElement.classList.add('selected');
        creatureElement.style.transform = 'scale(1.05)';
        creatureElement.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.6)';
        creatureElement.style.transition = 'all 0.3s ease';
      }
    } else if (selectedCreatures.find(c => c._id === creature._id)) {
      setSelectedCreatures(prev => prev.filter(c => c._id !== creature._id));
      
      // Deselection animation
      if (creatureElement) {
        creatureElement.classList.remove('selected');
        creatureElement.style.transform = 'scale(1)';
        creatureElement.style.boxShadow = 'none';
      }
    }
  };

  const startBattle = () => {
    if (selectedCreatures.length === 2) {
      const c1 = { 
        ...selectedCreatures[0], 
        currentHp: selectedCreatures[0].hp,
        statusEffects: [],
        id: 1
      };
      const c2 = { 
        ...selectedCreatures[1], 
        currentHp: selectedCreatures[1].hp,
        statusEffects: [],
        id: 2
      };
      
      // Smooth transition to battle state
      const selectionSection = document.querySelector('.creature-selection');
      if (selectionSection) {
        // Add fade-out animation with CSS
        selectionSection.style.transition = 'opacity 0.5s ease-out';
        selectionSection.style.opacity = '0';
        
        setTimeout(() => {
          setCreature1(c1);
          setCreature2(c2);
          setGameState('battle');
          setBattleLog([]);
          addLogEntry(`${c1.name} VS ${c2.name} - BATTLE START!`, 'special');
        }, 500);
      } else {
        setCreature1(c1);
        setCreature2(c2);
        setGameState('battle');
        setBattleLog([]);
        addLogEntry(`${c1.name} VS ${c2.name} - BATTLE START!`, 'special');
      }
    }
  };

  // ⚔️ EPIC ATTACK PERFORMANCE - Completely rewritten with epic animations!
  const performEpicAttack = (attacker, defender, attackerNum, defenderNum, updateCreature) => {
    console.log('🎆 EPIC ATTACK INITIATED:', attacker.name, 'vs', defender.name);
    
    // Get DOM elements with refs for better performance
    const attackerElement = attackerNum === 1 ? creature1Ref.current : creature2Ref.current;
    const defenderElement = defenderNum === 1 ? creature1Ref.current : creature2Ref.current;
    const defenderHealthBar = defenderNum === 1 ? healthBar1Ref.current : healthBar2Ref.current;
    
    // Fallback check
    if (!attackerElement || !defenderElement) {
      console.log('🚨 DOM elements missing, using fallback');
      executeSimplifiedAttack(attacker, defender, attackerNum, defenderNum, updateCreature);
      return;
    }

    // 🎯 Determine attack type and calculate damage
    const isSpecial = Math.random() < 0.3;
    const damageInfo = calculateDamage(attacker, defender, isSpecial);
    const damage = damageInfo.damage;
    const newHp = Math.max(0, defender.currentHp - damage);
    const newHealthPercent = (newHp / defender.hp) * 100;
    
    // 🎬 Set animation state
    setAttackPhase('charging');
    setCurrentAttacker(attackerNum);
    setDamageAmount(damage);
    setIsSpecialAttack(isSpecial);
    setElementType(attacker.type || 'normal');
    
    // Determine damage type for visual effects
    let dType = 'normal';
    if (damageInfo.critical) dType = 'critical';
    else if (isSpecial) dType = 'special';
    else if (damageInfo.advantage) dType = 'advantage';
    setDamageType(dType);
    
    // 🎆 EPIC ATTACK SEQUENCE STARTS HERE!
    addLogEntry(`${attacker.name} is charging up an ${isSpecial ? 'EPIC SPECIAL' : 'attack'}...`, isSpecial ? 'special' : 'damage');
    
    // Add targeting indicator
    defenderElement.classList.add('targeting-indicator');
    if (isSpecial) attackerElement.classList.add('charging-aura');
    
    // 🚀 Execute the epic combo sequence
    const epicSequence = epicBattleAnimations.comboAttackSequence(
      attackerElement,
      defenderElement,
      {
        isSpecial,
        elementType: attacker.type || 'normal',
        damage: `-${damage}`,
        damageType: dType
      },
      defenderHealthBar,
      newHealthPercent
    );
    
    // Track animation for cleanup
    currentAnimations.current.push(epicSequence);
    
    // 💫 Handle sequence completion
    epicSequence.eventCallback('onComplete', () => {
      // Clean up classes
      defenderElement.classList.remove('targeting-indicator');
      attackerElement.classList.remove('charging-aura');
      
      // Update creature HP
      updateCreature(defenderNum, { currentHp: newHp });
      
      // 🎆 Add epic battle log
      let logText = `${attacker.name} `;
      if (isSpecial) {
        logText += `unleashes ${attacker.special} for `;
      } else {
        logText += `attacks for `;
      }
      logText += `${damage} EPIC damage`;
      
      if (damageInfo.critical) logText += ' (CRITICAL HIT!)';
      if (damageInfo.advantage) logText += ' (TYPE ADVANTAGE!)';
      if (isSpecial && attacker.tier === 'Dissonant') logText += ' (DISSONANT POWER!)';
      
      addLogEntry(logText, damageInfo.critical ? 'critical' : (isSpecial ? 'special' : 'damage'));
      
      // 🎅 Handle healing if attacker has heal ability
      if (attacker.heal > 0 && attacker.currentHp < attacker.hp) {
        setTimeout(() => {
          const healAmount = Math.floor(attacker.heal * (0.8 + Math.random() * 0.4));
          const newAttackerHp = Math.min(attacker.hp, attacker.currentHp + healAmount);
          updateCreature(attackerNum, { currentHp: newAttackerHp });
          
          // Epic healing animation
          createEpicDamageNumber(attackerElement, `+${healAmount}`, 'heal');
          addLogEntry(`${attacker.name} regenerates ${healAmount} HP!`, 'heal');
          
          // Update attacker's health bar
          const attackerHealthBar = attackerNum === 1 ? healthBar1Ref.current : healthBar2Ref.current;
          if (attackerHealthBar) {
            epicBattleAnimations.animateHealthBar(
              attackerHealthBar,
              (newAttackerHp / attacker.hp) * 100,
              0.8
            );
          }
        }, 500);
      }
      
      // 🏆 Check for victory
      if (newHp <= 0) {
        setTimeout(() => {
          epicBattleAnimations.epicVictoryCelebration(attackerElement);
          endBattle(attacker);
        }, 800);
        return;
      }
      
      // Reset animation state and continue battle
      setAttackPhase('idle');
      setCurrentAttacker(null);
      setTimeout(() => setBattleTurnActive(false), 1000);
    });
  };

  // 🚨 SIMPLIFIED ATTACK FALLBACK - For when DOM elements aren't ready
  const executeSimplifiedAttack = (attacker, defender, attackerNum, defenderNum, updateCreature) => {
    const isSpecial = Math.random() < 0.3;
    const damageInfo = calculateDamage(attacker, defender, isSpecial);
    const damage = damageInfo.damage;
    const newHp = Math.max(0, defender.currentHp - damage);
    
    addLogEntry(`${attacker.name} is preparing to attack...`, 'special');
    setTimeout(() => {
      const attackType = isSpecial ? attacker.special : 'attacks';
      addLogEntry(`${attacker.name} ${isSpecial ? 'uses ' + attackType : attackType} for ${damage} damage!`, isSpecial ? 'special' : 'damage');
      updateCreature(defenderNum, { currentHp: newHp });
      
      if (newHp <= 0) {
        endBattle(attacker);
      } else {
        setTimeout(() => setBattleTurnActive(false), 500);
      }
    }, 1000);
  };

  const executeBattleTurn = () => {
    console.log('🎯 executeBattleTurn called');
    
    // Check if battle should continue
    if (!creature1 || !creature2 || creature1.currentHp <= 0 || creature2.currentHp <= 0) {
      console.log('🛑 Battle ended - creature defeated');
      clearInterval(battleInterval.current);
      setBattleActive(false);
      return;
    }

    if (battleTurnActive) {
      console.log('⏸️ Battle turn already in progress, skipping');
      return;
    }

    console.log('✅ Executing battle turn');
    setBattleTurnActive(true);

    const updateCreature = (num, updates) => {
      if (num === 1) {
        setCreature1(prev => ({ ...prev, ...updates }));
      } else {
        setCreature2(prev => ({ ...prev, ...updates }));
      }
    };

    // Get current creature states for calculations
    const currentCreature1 = creature1;
    const currentCreature2 = creature2;

    // Determine attacker based on speed
    let attacker, defender, attackerNum, defenderNum;
    
    if (currentCreature1.speed >= currentCreature2.speed) {
      attacker = currentCreature1;
      defender = currentCreature2;
      attackerNum = 1;
      defenderNum = 2;
    } else {
      attacker = currentCreature2;
      defender = currentCreature1;
      attackerNum = 2;
      defenderNum = 1;
    }

    performEpicAttack(attacker, defender, attackerNum, defenderNum, updateCreature);
  };

  const autoBattle = () => {
    console.log('🚀 Auto-battle starting');
    setBattleActive(true);
    addLogEntry('Auto-battle initiated!', 'special');
  };

  // 🏆 EPIC VICTORY SEQUENCE
  const endBattle = (winner) => {
    clearInterval(battleInterval.current);
    setBattleActive(false);
    setBattleTurnActive(false);
    
    // Clean up any running animations
    currentAnimations.current.forEach(animation => {
      if (animation && animation.kill) animation.kill();
    });
    currentAnimations.current = [];
    
    // Get winner element
    const winnerElement = winner.id === 1 ? creature1Ref.current : creature2Ref.current;
    
    if (winnerElement) {
      // Add victory glow class for continuous effect
      winnerElement.classList.add('victory-glow');
      
      // Epic victory celebration
      epicBattleAnimations.epicVictoryCelebration(winnerElement);
      
      // Epic victory screen flash
      createEpicScreenFlash('rgba(255, 215, 0, 0.4)', 0.8);
    }
    
    addLogEntry(`🎆 ${winner.name} ACHIEVES EPIC VICTORY! 🎆`, 'victory');
    setBattlesWon(prev => prev + 1);
    
    // Reset animation states
    setAttackPhase('idle');
    setCurrentAttacker(null);
  };

  // 🔄 RESET BATTLE WITH CLEANUP
  const resetBattle = () => {
    clearInterval(battleInterval.current);
    setBattleActive(false);
    setBattleTurnActive(false);
    
    // 🧹 Clean up all animations and effects
    currentAnimations.current.forEach(animation => {
      if (animation && animation.kill) animation.kill();
    });
    currentAnimations.current = [];
    
    // Clean up CSS classes
    if (creature1Ref.current) {
      creature1Ref.current.className = creature1Ref.current.className
        .replace(/\b(victory-glow|battle-ready|charging-aura|targeting-indicator|active-turn)\b/g, '')
        .trim();
    }
    if (creature2Ref.current) {
      creature2Ref.current.className = creature2Ref.current.className
        .replace(/\b(victory-glow|battle-ready|charging-aura|targeting-indicator|active-turn)\b/g, '')
        .trim();
    }
    
    // Reset all states
    setCreature1(null);
    setCreature2(null);
    setSelectedCreatures([]);
    setGameState('selection');
    setBattleLog([]);
    
    // Reset animation states
    setAttackPhase('idle');
    setCurrentAttacker(null);
    setDamageAmount(0);
    setDamageType('normal');
    setElementType('normal');
    setIsSpecialAttack(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="page-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'white' }}>
          <h2>⚔️ Loading Battle Arena...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
          <h2>⚠️ {error}</h2>
          <p>Visit the collection to collect creatures first!</p>
          <a href="/collection" style={{ color: '#ffd700', textDecoration: 'underline' }}>🎯 Begin Hunt</a>
        </div>
        <Footer />
      </div>
    );
  }

  // No creatures state
  if (creatures.length === 0) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
          <h2>⚠️ No Creatures Available</h2>
          <p>You need creatures to battle! Visit the collection to collect some.</p>
          <a href="/collection" style={{ color: '#ffd700', textDecoration: 'underline' }}>🎯 Begin Hunt</a>
        </div>
        <Footer />
      </div>
    );
  }

  // Render creature selection
  const renderCreatureSelection = () => (
    <div className="creature-selection">
      <h2>Choose Your Combatants ({selectedCreatures.length}/2)</h2>
      <div className="selection-grid">
        {creatures.map(creature => {
          const isSelected = selectedCreatures.find(c => c._id === creature._id);
          
          return (
            <div
              key={creature._id}
              className={`creature-option ${isSelected ? 'selected' : ''}`}
              onClick={() => selectCreature(creature)}
              style={{ position: 'relative' }}
              data-creature-id={creature._id}
            >
              <img 
                src={getPetImage(creature)} 
                alt={creature.name}
                onError={(e) => {
                  e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150"><rect fill="#333" width="200" height="150"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#fff" font-family="Arial" font-size="14">${creature.name}</text></svg>`;
                }}
              />
              <h4>{creature.name}</h4>
              <div className="tier">{creature.tier} • {creature.type}</div>
              <div className="power">💪 {creature.totalPower}</div>
            </div>
          );
        })}
      </div>
      <button 
        className="battle-btn" 
        onClick={startBattle}
        disabled={selectedCreatures.length !== 2}
      >
        Start Epic Battle ({selectedCreatures.length}/2)
      </button>
    </div>
  );

  // 🎬 EPIC CREATURE CARD RENDERER - Enhanced with animation support
  const renderEpicCreatureCard = (creature, cardId, isCreature1 = true) => {
    if (!creature) return null;
    
    const healthPercentage = Math.max(0, (creature.currentHp / creature.hp) * 100);
    const isCriticalHealth = healthPercentage <= 25;
    const isCurrentAttacker = currentAttacker === (isCreature1 ? 1 : 2);
    
    // Dynamic classes based on battle state
    let cardClasses = `battle-container creature-card ${creature.type.toLowerCase()}-type gpu-accelerated`;
    
    // Add animation classes based on state
    if (gameState === 'battle') {
      cardClasses += ` battle-ready ${creature.type.toLowerCase()}-idle-glow`;
    }
    if (isCurrentAttacker && attackPhase === 'charging') {
      cardClasses += ' charging-aura';
    }
    if (currentAttacker && currentAttacker !== (isCreature1 ? 1 : 2) && attackPhase === 'charging') {
      cardClasses += ' targeting-indicator';
    }
    if (isCurrentAttacker) {
      cardClasses += ' active-turn';
    }
    
    return (
      <div 
        className={cardClasses}
        id={cardId}
        ref={isCreature1 ? creature1Ref : creature2Ref}
      >
        {/* 🎆 Battle particles background */}
        <div className="battle-particles"></div>
        
        {/* 🐈 Creature image - STAYS STATIC as requested */}
        <img 
          className="creature-image" 
          src={getPetImage(creature)} 
          alt={creature.name}
          style={{ position: 'relative', zIndex: 3 }}
        />
        
        {/* 🏷️ Creature name with dynamic glow */}
        <h3 className={`creature-name ${isCurrentAttacker ? 'idle-glow' : ''}`}>
          {creature.name}
        </h3>
        
        {/* ❤️ Epic health bar with refs for animation */}
        <div className="health-bar">
          <div 
            ref={isCreature1 ? healthBar1Ref : healthBar2Ref}
            className={`health-fill ${isCriticalHealth ? 'critical-health-pulse' : ''}`}
            style={{ width: `${healthPercentage}%` }}
          />
          <span className="health-text">
            {Math.max(0, Math.floor(creature.currentHp))}/{creature.hp}
          </span>
        </div>
        
        {/* 📊 Enhanced stats display */}
        <div className="creature-stats">
          <div className="stat">
            <span className="stat-label">Attack</span>
            <span className="stat-value">{creature.attack}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Speed</span>
            <span className="stat-value">{creature.speed}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Type</span>
            <span className={`stat-value ${creature.type.toLowerCase()}-type-text`}>{creature.type}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Special</span>
            <span className="stat-value special-ability">{creature.special}</span>
          </div>
        </div>
        
        {/* 🎯 Attack phase indicator */}
        {isCurrentAttacker && attackPhase !== 'idle' && (
          <div className="attack-phase-indicator">
            {attackPhase === 'charging' && '⚡ CHARGING'}
            {attackPhase === 'attacking' && '💥 ATTACKING'}
            {attackPhase === 'impact' && '🎆 IMPACT'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sanctum-arena">
      <DevCheatPanel
        onAddCoins={addCoins}
        onUnlockAllPets={unlockAllPets}
        onResetBattle={resetBattle}
        onForceEnvironment={forceEnvironment}
        onSetCreatureTier={setCreatureTier}
      />
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .sanctum-arena {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a0f1f 50%, #0d0d1f 100%);
          color: #fff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .main-content {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .battle-stage {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .arena-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .arena-title {
          font-size: 3.5rem;
          background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
          animation: glow 3s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from { text-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
          to { text-shadow: 0 0 40px rgba(255, 215, 0, 0.8); }
        }

        .arena-subtitle {
          font-size: 1.2rem;
          color: #ccc;
          margin-bottom: 20px;
        }

        .battles-won {
          background: linear-gradient(45deg, #8B4513, #A0522D);
          padding: 10px 20px;
          border-radius: 25px;
          display: inline-block;
          font-weight: bold;
          border: 2px solid #FFD700;
        }

        /* Creature Selection Styles */
        .creature-selection {
          text-align: center;
        }

        .creature-selection h2 {
          font-size: 2rem;
          margin-bottom: 30px;
          color: #ffd700;
        }

        .selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
          padding: 20px;
        }

        .creature-option {
          background: linear-gradient(145deg, #1a1a2e, #16213e);
          border: 3px solid transparent;
          border-radius: 15px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .creature-option:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
          border-color: #ffd700;
        }

        .creature-option.selected {
          border-color: #4ecdc4;
          background: linear-gradient(145deg, #0f3460, #1a1a2e);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(78, 205, 196, 0.4);
        }

        .creature-option.selected::after {
          content: '✓ SELECTED';
          position: absolute;
          top: 10px;
          right: 10px;
          background: #4ecdc4;
          color: #000;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .creature-option img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .creature-option h4 {
          font-size: 1.2rem;
          margin-bottom: 8px;
          color: #fff;
        }

        .creature-option .tier {
          font-size: 0.9rem;
          color: #ccc;
          margin-bottom: 5px;
        }

        .creature-option .power {
          font-size: 1rem;
          color: #ffd700;
          font-weight: bold;
        }

        /* Battle Arena Styles */
        .battle-arena {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin: 40px 0;
          flex-wrap: wrap;
          gap: 20px;
        }

        .creature-card {
          background: linear-gradient(145deg, #1a1a2e, #16213e);
          border: 3px solid #444;
          border-radius: 20px;
          padding: 20px;
          width: 300px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          transform: translateZ(0); /* GPU acceleration */
        }
        
        /* 🎆 Epic type-specific glows */
        .creature-card.fire-type.battle-ready {
          border-color: #ff6b6b;
          box-shadow: 0 0 15px rgba(255, 107, 107, 0.4);
        }
        
        .creature-card.water-type.battle-ready {
          border-color: #4ecdc4;
          box-shadow: 0 0 15px rgba(78, 205, 196, 0.4);
        }
        
        .creature-card.earth-type.battle-ready {
          border-color: #95e1d3;
          box-shadow: 0 0 15px rgba(149, 225, 211, 0.4);
        }
        
        .creature-card.air-type.battle-ready {
          border-color: #a8e6cf;
          box-shadow: 0 0 15px rgba(168, 230, 207, 0.4);
        }
        
        /* 🎯 Attack phase indicator */
        .attack-phase-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255, 215, 0, 0.9);
          color: #000;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: bold;
          z-index: 25;
          animation: phaseIndicatorPulse 1s ease-in-out infinite;
        }
        
        @keyframes phaseIndicatorPulse {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        /* 🌈 Type-specific text colors */
        .fire-type-text { color: #ff6b6b; }
        .water-type-text { color: #4ecdc4; }
        .earth-type-text { color: #95e1d3; }
        .air-type-text { color: #a8e6cf; }
        
        .special-ability {
          color: #ffd700;
          font-weight: bold;
        }

        .creature-card.fire-type { border-color: #ff6b6b; }
        .creature-card.water-type { border-color: #4ecdc4; }
        .creature-card.earth-type { border-color: #95e1d3; }
        .creature-card.air-type { border-color: #a8e6cf; }

        .creature-card.wind-up {
          animation: windUp 0.5s ease-in-out;
        }

        .creature-card.special-windup {
          animation: specialWindup 1s ease-in-out;
        }

        .creature-card.attacking {
          animation: attack 0.3s ease-out;
        }

        .creature-card.special-attack {
          animation: specialAttack 0.5s ease-out;
        }

        .creature-card.damaged {
          animation: damage 0.5s ease-out;
        }

        @keyframes windUp {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05) rotate(-2deg); }
        }

        @keyframes specialWindup {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1) rotate(-5deg); }
          75% { transform: scale(1.1) rotate(5deg); }
        }

        @keyframes attack {
          0% { transform: translateX(0); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }

        @keyframes specialAttack {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        @keyframes damage {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-50px);
            opacity: 0;
          }
        }

        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }

        .creature-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 15px;
          margin-bottom: 15px;
        }

        .creature-name {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: #ffd700;
        }

        .health-bar {
          background: #333;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 15px;
          position: relative;
          height: 20px;
        }

        .health-fill {
          height: 100%;
          background: linear-gradient(90deg, #4ecdc4, #44a08d);
          transition: width 0.5s ease;
          border-radius: 10px;
        }

        .health-fill.critical {
          background: linear-gradient(90deg, #ff6b6b, #ee5a52);
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .health-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: bold;
          color: #fff;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
          font-size: 0.9rem;
        }

        .creature-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .stat {
          text-align: left;
        }

        .stat-label {
          display: block;
          font-size: 0.8rem;
          color: #ccc;
        }

        .stat-value {
          display: block;
          font-size: 1.1rem;
          font-weight: bold;
          color: #fff;
        }

        .vs-display {
          font-size: 3rem;
          font-weight: bold;
          color: #ff6b6b;
          text-shadow: 0 0 20px rgba(255, 107, 107, 0.8);
          transition: all 0.3s ease;
          transform: translateZ(0);
        }
        
        .vs-display.battle-active {
          color: #ffd700;
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.9);
          animation: battleVsPulse 2s ease-in-out infinite alternate;
        }
        
        .vs-display.combat-active {
          color: #ff1744;
          text-shadow: 0 0 40px rgba(255, 23, 68, 1);
          transform: scale(1.2);
        }
        
        @keyframes battleVsPulse {
          0% {
            transform: scale(1);
            filter: brightness(1);
          }
          100% {
            transform: scale(1.1);
            filter: brightness(1.3);
          }
        }

        /* Battle Controls */
        .battle-controls {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 30px 0;
        }

        .battle-btn {
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
          letter-spacing: 1px;
        }

        .battle-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
        }

        .battle-btn:disabled {
          background: #666;
          cursor: not-allowed;
          opacity: 0.6;
        }

        /* Battle Log */
        .battle-log {
          background: rgba(0, 0, 0, 0.8);
          border-radius: 15px;
          padding: 20px;
          margin-top: 30px;
          max-height: 300px;
          overflow-y: auto;
        }

        .battle-log h3 {
          color: #ffd700;
          margin-bottom: 15px;
          text-align: center;
        }

        .log-entry {
          padding: 8px 12px;
          margin: 5px 0;
          border-radius: 8px;
        }

        .log-entry.damage { background: rgba(255, 107, 107, 0.2); }
        .log-entry.heal { background: rgba(78, 205, 196, 0.2); }
        .log-entry.special { background: rgba(255, 215, 0, 0.2); }
        .log-entry.critical { background: rgba(255, 0, 0, 0.3); }
        .log-entry.victory { background: rgba(0, 255, 0, 0.2); }

        /* Responsive Design */
        @media (max-width: 768px) {
          .arena-title {
            font-size: 2.5rem;
          }

          .selection-grid {
            grid-template-columns: 1fr;
            padding: 10px;
          }

          .battle-arena {
            flex-direction: column;
          }

          .creature-card {
            width: 100%;
            max-width: 350px;
          }

          .battle-controls {
            flex-direction: column;
            align-items: center;
          }

          .vs-display {
            font-size: 2rem;
            margin: 20px 0;
          }
        }
      `}</style>

      {/* Header */}
      <header className="arena-header">
        <h1 className="arena-title">⚔️ Battle Arena</h1>
        <p className="arena-subtitle">Where legends clash and champions rise</p>
        {battlesWon > 0 && (
          <div className="battles-won">
            🏆 Battles Won: {battlesWon}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="battle-stage">
          {gameState === 'selection' && renderCreatureSelection()}

          {gameState === 'battle' && (
            <>
              {/* Battle Arena */}
              <div className="battle-arena">
                {renderEpicCreatureCard(creature1, 'creature1Card', true)}
                
                {/* 🆚 Epic VS Display with battle state */}
                <div className={`vs-display ${battleActive ? 'battle-active' : ''} ${attackPhase !== 'idle' ? 'combat-active' : ''}`}>
                  {attackPhase === 'idle' ? 'VS' : '💥'}
                </div>

                {renderEpicCreatureCard(creature2, 'creature2Card', false)}
              </div>

              {/* Battle Controls */}
              <div className="battle-controls">
                <button 
                  className="battle-btn" 
                  onClick={autoBattle}
                  disabled={battleActive}
                >
                  {battleActive ? 'Battle in Progress...' : 'Let the Battle Begin!'}
                </button>
                <button className="battle-btn" onClick={resetBattle}>
                  New Battle
                </button>
              </div>

              {/* Battle Log */}
              {battleLog.length > 0 && (
                <div className="battle-log">
                  <h3>Battle Log</h3>
                  {battleLog.map((entry) => (
                    <div key={entry.id} className={`log-entry ${entry.type}`}>
                      {entry.text}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BattleArenaEnhanced;