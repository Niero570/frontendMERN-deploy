import React, { useState, useEffect } from 'react';
import CreatureCard from './CreatureCard';
import { useAuth } from '../content/authContent';
import Footer from './Footer';

function SanctumDashboard() {
  const { token } = useAuth();
  const [sanctumData, setSanctumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [animatingValues, setAnimatingValues] = useState({});

  useEffect(() => {
    const getSanctum = async () => {
      try {
        const response = await fetch('https://backendmern-ugqz.onrender.com/api/auth/sanctum', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          setSanctumData(data.sanctum);
        } else {
          setError(data.error || 'Failed to load Sanctum');
        }
        setLoading(false);
      } catch (error) {
        console.log('Error fetching sanctum:', error);
        setError('Network error loading Sanctum');
        setLoading(false);
      }
    };

    if (token) {
      getSanctum();
    }
  }, [token]);

  // Animated counter hook
  const useAnimatedCounter = (target, duration = 1000) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }, [target, duration]);
    
    return count;
  };

  // Toggle card expansion
  const toggleCard = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={loadingContainerStyles}>
          <div style={spinnerStyles}></div>
          <h2 style={loadingTextStyles}>🏛️ Loading your Sanctum...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div style={errorContainerStyles}>
          <h2>⚠️ Error</h2>
          <p>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!sanctumData) {
    return (
      <div className="page-container">
        <div style={errorContainerStyles}>
          <h2>📭 No Sanctum Data</h2>
          <p>No Sanctum data available.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Hero Header */}
      <section style={heroStyles}>
        <div style={heroContentStyles}>
          <div style={sanctumTitleContainerStyles}>
            <h1 style={sanctumTitleStyles}>
              🏛️ {sanctumData.tier}
            </h1>
            <p style={sanctumSubtitleStyles}>
              {sanctumData.title} • Dragon Hunter {sanctumData.user.username}
            </p>
          </div>
          <div style={sanctumIconStyles}>⚔️</div>
        </div>
      </section>

      {/* Stats Grid */}
      <section style={statsContainerStyles}>
        <div style={statsGridStyles}>
          <div 
            style={{...statCardStyles, ...collectionCardStyles, ...(expandedCard === 'collection' ? expandedCardStyles : {})}} 
            className="clickable-card"
            onClick={() => toggleCard('collection')}
          >
            <div style={statIconStyles}>📊</div>
            <h3 style={statTitleStyles}>Collection</h3>
            <p style={statValueStyles}>
              {sanctumData.stats.totalCreatures}<span style={statSubValueStyles}>/{sanctumData.stats.capacity}</span>
            </p>
            <div style={progressBarStyles}>
              <div style={{
                ...progressFillStyles,
                width: `${(sanctumData.stats.totalCreatures / sanctumData.stats.capacity) * 100}%`
              }}></div>
            </div>
            
            {expandedCard === 'collection' && (
              <div style={expandedContentStyles}>
                <div style={expandedStatsStyles}>
                  <div style={expandedStatItemStyles}>
                    <span>Capacity Utilization</span>
                    <span style={expandedStatValueStyles}>{Math.round((sanctumData.stats.totalCreatures / sanctumData.stats.capacity) * 100)}%</span>
                  </div>
                  <div style={expandedStatItemStyles}>
                    <span>Available Slots</span>
                    <span style={expandedStatValueStyles}>{sanctumData.stats.capacity - sanctumData.stats.totalCreatures}</span>
                  </div>
                  <div style={expandedStatItemStyles}>
                    <span>Tier Bonus</span>
                    <span style={expandedStatValueStyles}>+{sanctumData.stats.capacity - 20} slots</span>
                  </div>
                </div>
                <div style={expandedDescStyles}>
                  Your {sanctumData.tier} tier grants enhanced collection capacity. Continue growing your prestige to unlock even more slots!
                </div>
              </div>
            )}
          </div>

          <div 
            style={{...statCardStyles, ...prestigeCardStyles, ...(expandedCard === 'prestige' ? expandedCardStyles : {})}} 
            className="clickable-card"
            onClick={() => toggleCard('prestige')}
          >
            <div style={statIconStyles}>👑</div>
            <h3 style={statTitleStyles}>Total Prestige</h3>
            <PrestigeCounter 
              target={sanctumData.stats.totalPrestige} 
              isExpanded={expandedCard === 'prestige'}
              averagePrestige={sanctumData.stats.averagePrestige}
            />
            
            {expandedCard === 'prestige' && (
              <div style={expandedContentStyles}>
                <div style={expandedStatsStyles}>
                  {sanctumData.collection.creatures.length > 0 ? (
                    <>
                      <div style={expandedStatItemStyles}>
                        <span>Highest Creature</span>
                        <span style={expandedStatValueStyles}>{Math.max(...sanctumData.collection.creatures.map(c => c.meta.prestigeValue))}</span>
                      </div>
                      <div style={expandedStatItemStyles}>
                        <span>Lowest Creature</span>
                        <span style={expandedStatValueStyles}>{Math.min(...sanctumData.collection.creatures.map(c => c.meta.prestigeValue))}</span>
                      </div>
                      <div style={expandedStatItemStyles}>
                        <span>Prestige Range</span>
                        <span style={expandedStatValueStyles}>{Math.max(...sanctumData.collection.creatures.map(c => c.meta.prestigeValue)) - Math.min(...sanctumData.collection.creatures.map(c => c.meta.prestigeValue))}</span>
                      </div>
                    </>
                  ) : (
                    <div style={expandedStatItemStyles}>
                      <span>No creatures yet</span>
                      <span style={expandedStatValueStyles}>Start collecting!</span>
                    </div>
                  )}
                </div>
                <div style={expandedDescStyles}>
                  Your prestige determines your sanctum tier. Higher prestige creatures unlock greater evolution bonuses and tier benefits!
                </div>
              </div>
            )}
          </div>

          <div 
            style={{...statCardStyles, ...bonusCardStyles, ...(expandedCard === 'bonus' ? expandedCardStyles : {})}} 
            className="clickable-card"
            onClick={() => toggleCard('bonus')}
          >
            <div style={statIconStyles}>⚡</div>
            <h3 style={statTitleStyles}>Evolution Bonus</h3>
            <p style={statValueStyles}>+{Math.round((sanctumData.stats.evolutionBonus - 1) * 100)}%</p>
            <p style={statDescStyles}>Power Multiplier</p>
            
            {expandedCard === 'bonus' && (
              <div style={expandedContentStyles}>
                <div style={expandedStatsStyles}>
                  <div style={expandedStatItemStyles}>
                    <span>Base Multiplier</span>
                    <span style={expandedStatValueStyles}>1.0x</span>
                  </div>
                  <div style={expandedStatItemStyles}>
                    <span>Current Multiplier</span>
                    <span style={expandedStatValueStyles}>{sanctumData.stats.evolutionBonus.toFixed(2)}x</span>
                  </div>
                  <div style={expandedStatItemStyles}>
                    <span>Bonus Gained</span>
                    <span style={expandedStatValueStyles}>+{(sanctumData.stats.evolutionBonus - 1).toFixed(2)}x</span>
                  </div>
                </div>
                <div style={expandedDescStyles}>
                  Evolution bonuses are earned through creature diversity and tier progression. Each new tier unlocks enhanced multipliers!
                </div>
              </div>
            )}
          </div>

          <div 
            style={{...statCardStyles, ...currencyCardStyles, ...(expandedCard === 'currency' ? expandedCardStyles : {})}} 
            className="clickable-card"
            onClick={() => toggleCard('currency')}
          >
            <div style={statIconStyles}>🪙</div>
            <h3 style={statTitleStyles}>Dragon Coins</h3>
            <CurrencyCounter 
              target={sanctumData.user.currency} 
              isExpanded={expandedCard === 'currency'}
            />
            
            {expandedCard === 'currency' && (
              <div style={expandedContentStyles}>
                <div style={expandedStatsStyles}>
                  <div style={expandedStatItemStyles}>
                    <span>Spending Power</span>
                    <span style={expandedStatValueStyles}>{sanctumData.user.currency > 1000 ? 'High' : sanctumData.user.currency > 500 ? 'Medium' : 'Low'}</span>
                  </div>
                  <div style={expandedStatItemStyles}>
                    <span>Currency Tier</span>
                    <span style={expandedStatValueStyles}>{sanctumData.user.currency > 2000 ? 'Wealthy' : sanctumData.user.currency > 1000 ? 'Comfortable' : 'Growing'}</span>
                  </div>
                  <div style={expandedStatItemStyles}>
                    <span>Next Goal</span>
                    <span style={expandedStatValueStyles}>{sanctumData.user.currency < 1000 ? '1,000' : sanctumData.user.currency < 2000 ? '2,000' : '5,000'}</span>
                  </div>
                </div>
                <div style={expandedDescStyles}>
                  Dragon Coins are earned through creature hunting and achievements. Use them to unlock premium sanctum upgrades!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tier Progress */}
        <div style={tierProgressContainerStyles}>
          <h3 style={tierProgressTitleStyles}>🎯 Next Tier Progress</h3>
          {sanctumData.stats.nextTierRequirement !== 'Maximum Achieved' ? (
            <div style={tierProgressStyles}>
              <div style={tierProgressTextStyles}>
                <span>Current: {sanctumData.stats.totalPrestige.toLocaleString()}</span>
                <span>Next: {sanctumData.stats.nextTierRequirement.toLocaleString()}</span>
              </div>
              <div style={tierProgressBarStyles}>
                <div style={{
                  ...tierProgressFillStyles,
                  width: `${(sanctumData.stats.totalPrestige / sanctumData.stats.nextTierRequirement) * 100}%`
                }}></div>
              </div>
            </div>
          ) : (
            <p style={maxTierStyles}>🏆 Maximum Tier Achieved!</p>
          )}
        </div>
      </section>

      {/* Creatures Collection */}
      <section style={collectionContainerStyles}>
        <div style={collectionHeaderStyles}>
          <h2 style={collectionTitleStyles}>
            🐲 Your Creature Collection ({sanctumData.collection.creatures.length})
          </h2>
          <p style={collectionDescStyles}>
            Manage your legendary creatures and view their enhanced powers
          </p>
        </div>

        {sanctumData.collection.creatures.length === 0 ? (
          <div style={emptyCollectionStyles}>
            <div style={emptyIconStyles}>📭</div>
            <h3>Your Sanctum Awaits</h3>
            <p>No creatures in your Sanctum yet. Visit the collection to start your collection!</p>
            <a href="/collection" style={collectionLinkStyles}>
              🎯 Begin Hunt
            </a>
          </div>
        ) : (
          <div style={creaturesGridStyles}>
            {sanctumData.collection.creatures.map((creature) => (
              <CreatureCard
                key={creature.userPetId}
                creature={creature}
                sanctumTier={sanctumData.tier}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

// Animated Counter Components
function PrestigeCounter({ target, isExpanded, averagePrestige }) {
  const [count, setCount] = useState(isExpanded ? 0 : target);
  
  useEffect(() => {
    if (isExpanded) {
      let start = 0;
      const increment = target / 60; // 1 second animation
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isExpanded, target]);
  
  return (
    <>
      <p style={statValueStyles}>{count.toLocaleString()}</p>
      <p style={statDescStyles}>Average: {averagePrestige}</p>
    </>
  );
}

function CurrencyCounter({ target, isExpanded }) {
  const [count, setCount] = useState(isExpanded ? 0 : target);
  
  useEffect(() => {
    if (isExpanded) {
      let start = 0;
      const increment = target / 60; // 1 second animation
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isExpanded, target]);
  
  return (
    <>
      <p style={statValueStyles}>{count}</p>
      <p style={statDescStyles}>Currency</p>
    </>
  );
}

// Styles
const loadingContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
  gap: '20px'
};

const spinnerStyles = {
  width: '50px',
  height: '50px',
  border: '5px solid #f3f3f3',
  borderTop: '5px solid #ffd700',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const loadingTextStyles = {
  color: '#ffd700',
  fontSize: '1.5rem'
};

const errorContainerStyles = {
  textAlign: 'center',
  padding: '60px 20px',
  background: 'rgba(255, 0, 0, 0.1)',
  borderRadius: '15px',
  border: '2px solid #ff4757',
  margin: '40px auto',
  maxWidth: '600px'
};

const heroStyles = {
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  color: '#fff',
  padding: '60px 20px',
  position: 'relative',
  overflow: 'hidden'
};

const heroContentStyles = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  zIndex: 2
};

const sanctumTitleContainerStyles = {
  flex: 1
};

const sanctumTitleStyles = {
  fontSize: '3.5rem',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
  background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
};

const sanctumSubtitleStyles = {
  fontSize: '1.3rem',
  opacity: '0.9',
  margin: 0
};

const sanctumIconStyles = {
  fontSize: '8rem',
  color: '#ff6b6b',
  textShadow: '0 0 40px rgba(255, 107, 107, 0.8)',
  animation: 'iconFloat 4s ease-in-out infinite'
};

const statsContainerStyles = {
  padding: '40px 20px',
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
};

const statsGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '30px',
  maxWidth: '1200px',
  margin: '0 auto 40px auto'
};

const statCardStyles = {
  background: '#fff',
  padding: '30px',
  borderRadius: '20px',
  textAlign: 'center',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  border: '3px solid transparent',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  position: 'relative'
};

const expandedCardStyles = {
  transform: 'scale(1.02)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  zIndex: 10
};

const expandedContentStyles = {
  marginTop: '20px',
  padding: '20px',
  borderTop: '2px solid #f0f0f0',
  textAlign: 'left',
  animation: 'slideDown 0.3s ease-out'
};

const expandedStatsStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '15px'
};

const expandedStatItemStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid #f0f0f0'
};

const expandedStatValueStyles = {
  fontWeight: 'bold',
  color: '#2c3e50',
  fontSize: '1.1rem'
};

const expandedDescStyles = {
  fontSize: '0.9rem',
  color: '#6c757d',
  fontStyle: 'italic',
  lineHeight: '1.4',
  background: 'rgba(255, 255, 255, 0.8)',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #e9ecef'
};

const collectionCardStyles = {
  borderColor: '#4ecdc4'
};

const prestigeCardStyles = {
  borderColor: '#ffd700'
};

const bonusCardStyles = {
  borderColor: '#ff6b6b'
};

const currencyCardStyles = {
  borderColor: '#a855f7'
};

const statIconStyles = {
  fontSize: '2.5rem',
  marginBottom: '15px',
  display: 'block'
};

const statTitleStyles = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
  color: '#2c3e50'
};

const statValueStyles = {
  fontSize: '2.2rem',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  color: '#2c3e50'
};

const statSubValueStyles = {
  fontSize: '1.4rem',
  opacity: '0.6'
};

const statDescStyles = {
  fontSize: '0.9rem',
  color: '#6c757d',
  margin: 0
};

const progressBarStyles = {
  width: '100%',
  height: '8px',
  background: '#e9ecef',
  borderRadius: '4px',
  marginTop: '10px',
  overflow: 'hidden'
};

const progressFillStyles = {
  height: '100%',
  background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
  borderRadius: '4px',
  transition: 'width 0.3s ease'
};

const tierProgressContainerStyles = {
  background: '#fff',
  padding: '30px',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  maxWidth: '600px',
  margin: '0 auto',
  textAlign: 'center'
};

const tierProgressTitleStyles = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  color: '#2c3e50'
};

const tierProgressStyles = {
  textAlign: 'left'
};

const tierProgressTextStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px',
  fontSize: '0.9rem',
  color: '#6c757d'
};

const tierProgressBarStyles = {
  width: '100%',
  height: '12px',
  background: '#e9ecef',
  borderRadius: '6px',
  overflow: 'hidden'
};

const tierProgressFillStyles = {
  height: '100%',
  background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
  borderRadius: '6px',
  transition: 'width 0.3s ease'
};

const maxTierStyles = {
  fontSize: '1.2rem',
  color: '#ffd700',
  fontWeight: 'bold',
  margin: 0
};

const collectionContainerStyles = {
  padding: '60px 20px',
  background: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
  color: '#fff'
};

const collectionHeaderStyles = {
  textAlign: 'center',
  marginBottom: '50px',
  maxWidth: '800px',
  margin: '0 auto 50px auto'
};

const collectionTitleStyles = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
  background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
};

const collectionDescStyles = {
  fontSize: '1.1rem',
  opacity: '0.9',
  margin: 0
};

const emptyCollectionStyles = {
  textAlign: 'center',
  padding: '80px 20px',
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  border: '2px dashed rgba(255, 255, 255, 0.3)',
  maxWidth: '500px',
  margin: '0 auto'
};

const emptyIconStyles = {
  fontSize: '4rem',
  marginBottom: '20px',
  display: 'block',
  opacity: '0.7'
};

const collectionLinkStyles = {
  display: 'inline-block',
  background: 'linear-gradient(45deg, #ff6b6b, #ff8787)',
  color: '#fff',
  textDecoration: 'none',
  padding: '15px 30px',
  borderRadius: '25px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  marginTop: '20px',
  transition: 'all 0.3s ease'
};

const creaturesGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '30px',
  maxWidth: '1400px',
  margin: '0 auto'
};

// Add CSS animations
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes iconFloat {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(5deg); }
    }
    
    @keyframes slideDown {
      0% { 
        opacity: 0; 
        transform: translateY(-20px); 
        max-height: 0;
      }
      100% { 
        opacity: 1; 
        transform: translateY(0); 
        max-height: 500px;
      }
    }
    
    @keyframes pulse {
      0%, 100% { 
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); 
      }
      50% { 
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 0 4px rgba(255, 215, 0, 0.3); 
      }
    }
    
    .clickable-card {
      animation: pulse 3s ease-in-out infinite;
    }
    
    .clickable-card:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
      animation: none;
    }
    
    .page-container [style*="collectionLinkStyles"]:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
    }
    
    @media (max-width: 768px) {
      .hero-content {
        flex-direction: column !important;
        text-align: center !important;
        gap: 30px !important;
      }
      
      .sanctum-title {
        font-size: 2.5rem !important;
      }
      
      .sanctum-icon {
        font-size: 5rem !important;
      }
      
      .stats-grid {
        grid-template-columns: 1fr !important;
        gap: 20px !important;
      }
      
      .creatures-grid {
        grid-template-columns: 1fr !important;
        gap: 20px !important;
      }
    }
  `;
  document.head.appendChild(style);
}

export default SanctumDashboard;