import { useEffect, useRef, useState } from 'react';
import { gvIntroSvg } from './gv-intro-svg';
import { gvTruckSvg } from './gv-truck-svg';
import { createSound, exitSound, introSounds } from './gv-sound';

export default function IntroOverlay() {
  const [visible, setVisible] = useState(true);
  const [running, setRunning] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [muted, setMuted] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finishedRef = useRef(false);
  const exitingRef = useRef(false);
  const soundRef = useRef(createSound(0.3));
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const MIN_SHOW = 2400;
    const MAX_WAIT = 6000;
    const EXIT_FINISH = 2650;
    const sound = soundRef.current;

    const root = document.documentElement;

    function clearTimers() {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    }

    function finish() {
      if (finishedRef.current) return;
      finishedRef.current = true;
      clearTimers();
      sound.fadeOut();
      root.classList.remove('gv-lock');
      root.classList.add('gv-ready');
      setVisible(false);
    }

    function exit() {
      if (finishedRef.current || exitingRef.current) return;
      exitingRef.current = true;
      setExiting(true);
      sound.play((c, o, t) => exitSound(c, o, t));
      timersRef.current.push(setTimeout(finish, EXIT_FINISH));
    }

    root.classList.add('gv-lock');
    root.classList.remove('gv-ready');

    sound.init();
    sound.newBus();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (elRef.current) void elRef.current.offsetWidth;
        setRunning(true);
        introSounds.forEach((s) => {
          timersRef.current.push(
            setTimeout(() => {
              sound.play((c, o, t) => {
                const fn = (sound.fx as any)[s.name];
                if (fn) fn(c, o, t, ...s.params);
              });
            }, s.time)
          );
        });
      });
    });

    const minTimer = new Promise<void>((resolve) => {
      timersRef.current.push(setTimeout(resolve, MIN_SHOW));
    });
    const loadPromise = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', () => resolve(), { once: true });
    });
    const capPromise = new Promise<void>((resolve) => {
      timersRef.current.push(setTimeout(resolve, MAX_WAIT));
    });

    Promise.all([minTimer, Promise.race([loadPromise, capPromise])]).then(exit);

    function handleClick() { exit(); }
    document.addEventListener('click', handleClick, { once: true });

    return () => {
      clearTimers();
      root.classList.remove('gv-lock');
      document.removeEventListener('click', handleClick);
    };
  }, []);

  function handleSoundClick(e: React.MouseEvent) {
    e.stopPropagation();
    const sound = soundRef.current;
    if (!sound.running()) {
      sound.setMuted(false);
      sound.resume().then(() => {
        setSoundOn(true);
        setMuted(false);
      });
    } else {
      const newMuted = !sound.isMuted();
      sound.setMuted(newMuted);
      setMuted(newMuted);
      setSoundOn(!newMuted);
    }
  }

  if (!visible) return null;

  const className = exiting ? 'gv-exit' : running ? 'gv-run' : '';
  const soundAvailable = soundRef.current.available();
  const isOn = soundRef.current.running() && !muted;

  return (
    <div id="gv-intro" className={className} ref={elRef} aria-hidden="true">
      <div className="gv-panel">
        <div className="gv-edge" />
        <div dangerouslySetInnerHTML={{ __html: gvTruckSvg }} />
      </div>
      <div className="gv-stage" dangerouslySetInnerHTML={{ __html: gvIntroSvg }} />
      {soundAvailable && (
        <button className="gv-snd" type="button" aria-label="Som" onClick={handleSoundClick}>
          <span className="gv-snd-ico">{isOn ? '\u{1F50A}' : '\u{1F507}'}</span>
          <span className="gv-snd-txt">{!soundOn ? 'Ativar som' : ''}</span>
        </button>
      )}
    </div>
  );
}
