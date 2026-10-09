import React, {
  useEffect,
  useState
} from 'react';

const tg =
  window.Telegram?.WebApp;

function App() {
  const [user, setUser] =
    useState(null);

  const [coins, setCoins] =
    useState(0);

  const [energy, setEnergy] =
    useState(1000);

  const [maxEnergy, setMaxEnergy] =
    useState(1000);

  const [level, setLevel] =
    useState(1);

  const [xp, setXp] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();

      tg.setHeaderColor('#111827');
      tg.setBackgroundColor('#111827');

      setUser(
        tg.initDataUnsafe?.user || null
      );
    }

    loadUser();
  }, []);

  async function loadUser() {
    try {
      const telegramUser =
        tg?.initDataUnsafe?.user;

      if (!telegramUser?.id) {
        setLoading(false);
        return;
      }

      const response =
        await fetch(
          `/api/users/${telegramUser.id}`
        );

      const data =
        await response.json();

      if (
        data.success &&
        data.user
      ) {
        setCoins(
          Number(
            data.user.coins || 0
          )
        );

        setEnergy(
          Number(
            data.user.energy || 0
          )
        );

        setMaxEnergy(
          Number(
            data.user.maxEnergy || 1000
          )
        );

        setLevel(
          Number(
            data.user.level || 1
          )
        );

        setXp(
          Number(
            data.user.xp || 0
          )
        );
      }
    } catch (error) {
      console.error(
        'Load user error:',
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleTap() {
    const telegramUser =
      tg?.initDataUnsafe?.user;

    if (!telegramUser?.id) {
      return;
    }

    if (energy <= 0) {
      return;
    }

    try {
      const response =
        await fetch(
          '/api/tap/tap',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              telegramId:
                telegramUser.id,

              tapCount: 1
            })
          }
        );

      const data =
        await response.json();

      if (
        data.success &&
        data.user
      ) {
        setCoins(
          Number(
            data.user.coins || 0
          )
        );

        setEnergy(
          Number(
            data.user.energy || 0
          )
        );

        setMaxEnergy(
          Number(
            data.user.maxEnergy ||
              1000
          )
        );

        setLevel(
          Number(
            data.user.level || 1
          )
        );

        setXp(
          Number(
            data.user.xp || 0
          )
        );
      }
    } catch (error) {
      console.error(
        'Tap error:',
        error
      );
    }
  }

  if (loading) {
    return (
      <div className="app loading-screen">
        <div className="loader">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="app">

      <header className="top-bar">
        <div>
          <div className="app-title">
            🪙 Tap Rewards
          </div>

          <div className="welcome">
            Hi,{' '}
            {user?.first_name ||
              'Friend'}
          </div>
        </div>

        <div className="level-badge">
          LVL {level}
        </div>
      </header>


      <main className="main-content">

        <section className="balance-card">

          <div className="balance-label">
            Your Balance
          </div>

          <div className="balance">
            🪙{' '}
            {coins.toLocaleString()}
          </div>

          <div className="xp">
            XP: {xp.toLocaleString()}
          </div>

        </section>


        <section className="energy-section">

          <div className="energy-row">

            <span>
              ⚡ Energy
            </span>

            <span>
              {energy} / {maxEnergy}
            </span>

          </div>

          <div className="energy-bar">

            <div
              className="energy-fill"
              style={{
                width: `${
                  Math.max(
                    0,
                    Math.min(
                      100,
                      (energy /
                        maxEnergy) *
                        100
                    )
                  )
                }%`
              }}
            />

          </div>

        </section>


        <section className="tap-section">

          <button
            className="tap-button"
            onClick={handleTap}
            disabled={
              energy <= 0
            }
          >
            <span className="tap-icon">
              🪙
            </span>

            <span className="tap-text">
              TAP
            </span>
          </button>

        </section>


        <section className="quick-actions">

          <button>
            🎁
            <span>
              Daily
            </span>
          </button>

          <button>
            👥
            <span>
              Referral
            </span>
          </button>

          <button>
            📋
            <span>
              Tasks
            </span>
          </button>

          <button>
            💸
            <span>
              Withdraw
            </span>
          </button>

        </section>

      </main>

    </div>
  );
}

export default App;