import { animate as anime } from 'animejs';
import { gsap } from 'gsap';

/**
 * 🎬 EPIC BATTLE ANIMATIONS
 * High-performance animation helpers for an epic battle experience
 * Uses Anime.js for simple effects and GSAP for complex timelines
 * Designed for mobile-first performance and easy extensibility
 */

export const epicBattleAnimations = {

  // ⚡ ANIME.JS EFFECTS - Fast, Simple, Smooth

  /**
   * Creates an epic impact flash on hit
   * @param {HTMLElement} element - Target element
   * @param {string} color - Flash color (default: white)
   * @param {string} elementType - Element type for themed colors
   */
  impactFlash: (element, color = 'rgba(255, 255, 255, 0.9)', elementType = null) => {
    if (!element) return;
    
    // Themed colors based on element type
    const elementColors = {
      fire: 'rgba(255, 107, 107, 0.8)',
      water: 'rgba(78, 205, 196, 0.8)',
      earth: 'rgba(149, 225, 211, 0.8)',
      air: 'rgba(168, 230, 207, 0.8)'
    };
    
    const flashColor = elementType ? elementColors[elementType.toLowerCase()] || color : color;
    
    const overlay = document.createElement('div');
    overlay.className = 'impact-flash-overlay';
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${flashColor};
      pointer-events: none;
      z-index: 15;
      border-radius: 20px;
      mix-blend-mode: screen;
    `;
    
    element.style.position = 'relative';
    element.appendChild(overlay);
    
    return anime({
      targets: overlay,
      opacity: [0, 1, 0],
      scale: [0.8, 1.1, 1],
      duration: 400,
      ease: 'out(4)',
      onComplete: () => {
        if (element.contains(overlay)) {
          element.removeChild(overlay);
        }
      }
    });
  },

  /**
   * Epic shake animation with realistic physics
   * @param {HTMLElement} element - Element to shake
   * @param {number} intensity - Shake intensity (1-20)
   * @param {number} duration - Duration in ms
   */
  epicShake: (element, intensity = 12, duration = 600) => {
    if (!element) return;
    
    return anime({
      targets: element,
      translateX: [
        { value: intensity, duration: 50 },
        { value: -intensity * 0.8, duration: 50 },
        { value: intensity * 0.6, duration: 50 },
        { value: -intensity * 0.4, duration: 50 },
        { value: intensity * 0.2, duration: 50 },
        { value: 0, duration: duration - 250 }
      ],
      translateY: [
        { value: 0, duration: 25 },
        { value: intensity * 0.3, duration: 25 },
        { value: -intensity * 0.2, duration: 25 },
        { value: intensity * 0.1, duration: 25 },
        { value: 0, duration: duration - 100 }
      ],
      ease: 'outElastic(1, .6)'
    });
  },

  /**
   * Floating damage numbers with epic styling
   * @param {HTMLElement} element - Reference element for positioning
   * @param {string|number} damage - Damage amount to display
   * @param {string} type - Damage type (critical, heal, special, advantage, normal)
   */
  epicFloatingDamage: (element, damage, type = 'normal') => {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 3;
    
    const damageDiv = document.createElement('div');
    damageDiv.textContent = damage;
    damageDiv.className = `epic-damage-${type}`;
    
    const typeStyles = {
      critical: {
        color: '#ff1744',
        fontSize: '2.2rem',
        textShadow: '0 0 20px #ff1744, 2px 2px 8px rgba(0,0,0,0.9)',
        fontWeight: '900'
      },
      heal: {
        color: '#00e676',
        fontSize: '1.8rem',
        textShadow: '0 0 15px #00e676, 2px 2px 8px rgba(0,0,0,0.9)',
        fontWeight: 'bold'
      },
      special: {
        color: '#ffd700',
        fontSize: '2rem',
        textShadow: '0 0 25px #ffd700, 2px 2px 8px rgba(0,0,0,0.9)',
        fontWeight: '900'
      },
      advantage: {
        color: '#4caf50',
        fontSize: '1.9rem',
        textShadow: '0 0 18px #4caf50, 2px 2px 8px rgba(0,0,0,0.9)',
        fontWeight: 'bold'
      },
      normal: {
        color: '#f44336',
        fontSize: '1.7rem',
        textShadow: '0 0 12px #f44336, 2px 2px 8px rgba(0,0,0,0.9)',
        fontWeight: 'bold'
      }
    };
    
    const style = typeStyles[type] || typeStyles.normal;
    
    damageDiv.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: ${style.fontSize};
      font-weight: ${style.fontWeight};
      color: ${style.color};
      text-shadow: ${style.textShadow};
      pointer-events: none;
      z-index: 100;
      font-family: 'Arial Black', 'Arial', sans-serif;
      text-align: center;
      letter-spacing: 1px;
      transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(damageDiv);
    
    return anime({
      targets: damageDiv,
      translateY: -120,
      scale: [0.3, 1.3, 1],
      opacity: [0, 1, 1, 0],
      rotate: type === 'critical' ? [0, 10, -5, 0] : 0,
      duration: 2500,
      ease: 'outCubic',
      onComplete: () => {
        if (document.body.contains(damageDiv)) {
          document.body.removeChild(damageDiv);
        }
      }
    });
  },

  /**
   * Pulsing aura effect for charging/power-up
   * @param {HTMLElement} element - Element to apply aura
   * @param {string} color - Aura color
   * @param {number} intensity - Pulse intensity
   */
  chargingAura: (element, color = '#ffd700', intensity = 1.5) => {
    if (!element) return;
    
    return anime({
      targets: element,
      boxShadow: [
        `0 0 ${20 * intensity}px ${color}`,
        `0 0 ${40 * intensity}px ${color}`,
        `0 0 ${20 * intensity}px ${color}`
      ],
      scale: [1, 1 + (0.05 * intensity), 1],
      duration: 1500,
      loop: true,
      direction: 'alternate',
      ease: 'inOutSine'
    });
  },

  // 🎭 GSAP EFFECTS - Complex Timelines & Advanced Sequences

  /**
   * Smooth health bar animation with realistic drain
   * @param {HTMLElement} healthFill - Health bar fill element
   * @param {number} newWidth - New width percentage
   * @param {number} duration - Animation duration in seconds
   * @param {boolean} isCritical - Is health in critical range
   */
  animateHealthBar: (healthFill, newWidth, duration = 1.2, isCritical = false) => {
    if (!healthFill) return;
    
    const tl = gsap.timeline();
    
    // Quick flash to show damage
    tl.to(healthFill, {
      filter: 'brightness(1.5)',
      duration: 0.1,
      ease: "power2.out"
    })
    
    // Smooth drain with bounce at end
    .to(healthFill, {
      width: `${newWidth}%`,
      filter: 'brightness(1)',
      duration: duration,
      ease: "power2.out"
    })
    
    // Add critical pulsing if health is low
    if (isCritical && newWidth > 0) {
      tl.to(healthFill, {
        opacity: [1, 0.7, 1],
        duration: 0.5,
        repeat: 2,
        ease: "sine.inOut"
      });
    }
    
    return tl;
  },

  /**
   * EPIC attack sequence - the main show!
   * @param {HTMLElement} attackerElement - Attacking creature container
   * @param {HTMLElement} defenderElement - Defending creature container
   * @param {boolean} isSpecial - Is this a special attack
   * @param {string} elementType - Element type for themed effects
   */
  epicAttackSequence: (attackerElement, defenderElement, isSpecial = false, elementType = 'normal') => {
    if (!attackerElement || !defenderElement) return;
    
    const tl = gsap.timeline();
    const specialMultiplier = isSpecial ? 1.5 : 1;
    
    // 1. CHARGE PHASE - Wind up with anticipation
    tl.to(attackerElement, {
      scale: 1.1 * specialMultiplier,
      rotation: isSpecial ? 8 : 3,
      transformOrigin: "center center",
      duration: 0.4,
      ease: "back.out(1.7)",
      onStart: () => {
        // Add charging aura for special attacks
        if (isSpecial) {
          epicBattleAnimations.chargingAura(attackerElement, '#ffd700', 2);
        }
      }
    })
    
    // 2. STRIKE PHASE - Explosive attack motion
    .to(attackerElement, {
      scale: 1.3 * specialMultiplier,
      rotation: 0,
      duration: 0.15,
      ease: "power4.out"
    }, "strike")
    
    // 3. IMPACT PHASE - Hit the defender
    .to(defenderElement, {
      x: 20 * specialMultiplier,
      rotation: 5 * specialMultiplier,
      scale: 0.95,
      duration: 0.1,
      ease: "power3.out",
      onStart: () => {
        // Trigger impact flash
        epicBattleAnimations.impactFlash(defenderElement, null, elementType);
        // Trigger shake
        epicBattleAnimations.epicShake(defenderElement, 15 * specialMultiplier);
      }
    }, "strike")
    
    // 4. RECOVERY PHASE - Return to normal with style
    .to([attackerElement, defenderElement], {
      scale: 1,
      rotation: 0,
      x: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
      onComplete: () => {
        // Stop charging aura (handled by GSAP cleanup)
      }
    });
    
    return tl;
  },

  /**
   * Elemental overlay effect with particle-like motion
   * @param {HTMLElement} element - Target element
   * @param {string} elementType - Element type (fire, water, earth, air)
   */
  elementalOverlay: (element, elementType) => {
    if (!element) return;
    
    const elementEffects = {
      fire: {
        gradient: 'radial-gradient(circle, rgba(255, 107, 107, 0.6) 0%, rgba(238, 90, 82, 0.3) 50%, transparent 100%)',
        glow: '0 0 50px rgba(255, 107, 107, 0.8)',
        particles: '🔥'
      },
      water: {
        gradient: 'radial-gradient(circle, rgba(78, 205, 196, 0.6) 0%, rgba(68, 160, 141, 0.3) 50%, transparent 100%)',
        glow: '0 0 50px rgba(78, 205, 196, 0.8)',
        particles: '💧'
      },
      earth: {
        gradient: 'radial-gradient(circle, rgba(149, 225, 211, 0.6) 0%, rgba(118, 180, 169, 0.3) 50%, transparent 100%)',
        glow: '0 0 50px rgba(149, 225, 211, 0.8)',
        particles: '🌿'
      },
      air: {
        gradient: 'radial-gradient(circle, rgba(168, 230, 207, 0.6) 0%, rgba(134, 184, 165, 0.3) 50%, transparent 100%)',
        glow: '0 0 50px rgba(168, 230, 207, 0.8)',
        particles: '💨'
      }
    };
    
    const effect = elementEffects[elementType.toLowerCase()] || elementEffects.fire;
    
    // Create main overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      top: -15px;
      left: -15px;
      width: calc(100% + 30px);
      height: calc(100% + 30px);
      background: ${effect.gradient};
      box-shadow: ${effect.glow};
      pointer-events: none;
      z-index: 10;
      border-radius: 30px;
      opacity: 0;
      mix-blend-mode: screen;
    `;
    
    element.style.position = 'relative';
    element.appendChild(overlay);
    
    // Create floating particles
    const particles = [];
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.textContent = effect.particles;
      particle.style.cssText = `
        position: absolute;
        font-size: 1.2rem;
        pointer-events: none;
        z-index: 12;
        opacity: 0;
        top: 50%;
        left: 50%;
      `;
      element.appendChild(particle);
      particles.push(particle);
    }
    
    const tl = gsap.timeline();
    
    // Overlay animation
    tl.to(overlay, {
      opacity: 1,
      scale: 1.1,
      duration: 0.4,
      ease: "back.out(1.7)"
    })
    
    // Particle burst
    .to(particles, {
      opacity: 1,
      x: () => gsap.utils.random(-80, 80),
      y: () => gsap.utils.random(-80, 80),
      rotation: () => gsap.utils.random(0, 360),
      duration: 1,
      ease: "power2.out",
      stagger: 0.1
    }, 0.2)
    
    // Fade out everything
    .to([overlay, ...particles], {
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: "power2.in",
      onComplete: () => {
        if (element.contains(overlay)) element.removeChild(overlay);
        particles.forEach(p => {
          if (element.contains(p)) element.removeChild(p);
        });
      }
    }, 1);
    
    return tl;
  },

  /**
   * Victory celebration with epic particles and effects
   * @param {HTMLElement} winnerElement - Winner creature element
   */
  epicVictoryCelebration: (winnerElement) => {
    if (!winnerElement) return;
    
    // Create victory burst particles
    const particles = [];
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.textContent = ['✨', '⭐', '💫', '🎆'][Math.floor(Math.random() * 4)];
      particle.style.cssText = `
        position: absolute;
        font-size: 1.5rem;
        top: 50%;
        left: 50%;
        z-index: 25;
        pointer-events: none;
      `;
      winnerElement.appendChild(particle);
      particles.push(particle);
    }
    
    const tl = gsap.timeline();
    
    // Winner epic scale and glow
    tl.to(winnerElement, {
      scale: 1.2,
      boxShadow: "0 0 60px rgba(255, 215, 0, 0.9), 0 0 100px rgba(255, 215, 0, 0.6)",
      filter: "brightness(1.3) saturate(1.2)",
      duration: 0.8,
      ease: "back.out(1.7)"
    })
    
    // Particle explosion
    .to(particles, {
      x: () => gsap.utils.random(-150, 150),
      y: () => gsap.utils.random(-150, 150),
      rotation: () => gsap.utils.random(0, 720),
      scale: () => gsap.utils.random(0.5, 2),
      opacity: [0, 1, 0],
      duration: 2,
      ease: "power2.out",
      stagger: 0.1,
      onComplete: () => {
        particles.forEach(p => {
          if (winnerElement.contains(p)) winnerElement.removeChild(p);
        });
      }
    }, 0.3);
    
    return tl;
  },

  /**
   * Epic screen flash for ultimate attacks
   * @param {string} color - Flash color
   * @param {number} intensity - Flash intensity (0-1)
   */
  epicScreenFlash: (color = 'rgba(255, 215, 0, 0.7)', intensity = 1) => {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: ${color};
      pointer-events: none;
      z-index: 1000;
      opacity: 0;
      mix-blend-mode: screen;
    `;
    
    document.body.appendChild(flash);
    
    const tl = gsap.timeline();
    
    tl.to(flash, {
      opacity: intensity,
      duration: 0.1,
      ease: "power2.out"
    })
    .to(flash, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        if (document.body.contains(flash)) {
          document.body.removeChild(flash);
        }
      }
    });
    
    return tl;
  },

  // 🛠️ UTILITY FUNCTIONS

  /**
   * Stop all animations on element
   * @param {HTMLElement} element - Target element
   */
  stopAllAnimations: (element) => {
    if (!element) return;
    gsap.killTweensOf(element);
    // Note: anime v4 cleanup is handled automatically
  },

  /**
   * Check if element is currently animating
   * @param {HTMLElement} element - Element to check
   * @returns {boolean} True if animating
   */
  isAnimating: (element) => {
    if (!element) return false;
    return gsap.isTweening(element);
  },

  /**
   * Create a complete combo attack sequence
   * @param {HTMLElement} attacker - Attacker element
   * @param {HTMLElement} defender - Defender element
   * @param {Object} attackData - Attack data {isSpecial, elementType, damage, damageType}
   * @param {HTMLElement} healthBar - Defender's health bar
   * @param {number} newHealthPercent - New health percentage
   */
  comboAttackSequence: (attacker, defender, attackData, healthBar, newHealthPercent) => {
    const { isSpecial, elementType, damage, damageType } = attackData;
    
    const masterTimeline = gsap.timeline();
    
    // 1. Attack sequence
    masterTimeline.add(
      epicBattleAnimations.epicAttackSequence(attacker, defender, isSpecial, elementType)
    );
    
    // 2. Elemental overlay (if special)
    if (isSpecial && elementType !== 'normal') {
      masterTimeline.add(
        epicBattleAnimations.elementalOverlay(defender, elementType),
        "-=0.5"
      );
    }
    
    // 3. Screen flash for ultimate attacks
    if (isSpecial) {
      masterTimeline.add(
        epicBattleAnimations.epicScreenFlash(),
        "-=0.3"
      );
    }
    
    // 4. Floating damage number
    masterTimeline.call(() => {
      epicBattleAnimations.epicFloatingDamage(defender, damage, damageType);
    }, null, "-=0.2");
    
    // 5. Health bar animation
    if (healthBar) {
      masterTimeline.add(
        epicBattleAnimations.animateHealthBar(
          healthBar, 
          newHealthPercent, 
          1, 
          newHealthPercent <= 25
        ),
        "-=0.5"
      );
    }
    
    return masterTimeline;
  }
};

export default epicBattleAnimations;