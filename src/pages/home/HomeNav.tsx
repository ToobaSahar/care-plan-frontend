import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Logo } from '../../components/ui';
import { cn } from '../../lib/cn';
import { Container, START_LABEL, WORKSPACE_PATH, goToSection, useStartAssessment } from './layout';

export const NAV_LINKS = [
  { id: 'how', label: 'How it works' },
  { id: 'record', label: 'Try the record' },
  { id: 'plan', label: 'The plan' },
  { id: 'questions', label: 'Questions' },
] as const;

interface HomeNavProps {
  /** Signed-in staff are also offered their workspace. */
  signedIn: boolean;
  reducedMotion: boolean;
}

/**
 * A plain bar: the lockup, a few links into the page, the platform's main
 * action. On the oat ground throughout, as every top bar in CareFrame is; a
 * hairline appears once the page moves under it.
 *
 * On a phone the bar carries the lockup and the action only. The links are
 * anchors into this same page, which a phone reads top to bottom anyway, and
 * the footer repeats them; a menu would cover the content to save a scroll.
 */
export const HomeNav: React.FC<HomeNavProps> = ({ signedIn, reducedMotion }) => {
  const navigate = useNavigate();
  const startAssessment = useStartAssessment();
  const [scrolled, setScrolled] = useState(false);
  // While the hero's own buttons are on screen, a second identical action in
  // the bar is noise on a phone; it appears once they have scrolled away.
  const [heroActionsVisible, setHeroActionsVisible] = useState(true);

  /* One measurement per scroll frame answers both questions. Read from the
     layout rather than from an observer's crossing notices, which can arrive
     out of order with a jump made as the page loads and leave the action
     hidden on a screen where the hero is long gone. */
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
      const hero = document.getElementById('hero-actions')?.getBoundingClientRect();
      // The bar covers the top 64px; buttons beneath it are not really in view.
      setHeroActionsVisible(Boolean(hero && hero.bottom > 64 && hero.top < window.innerHeight));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const onLink = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    // Modified clicks keep their browser meaning (new tab, copy link).
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    goToSection(id, reducedMotion);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-oat-100 transition-[border-color] duration-slow ease-out',
        scrolled ? 'border-oat-200' : 'border-transparent',
      )}
    >
      <Container className="flex h-16 items-center gap-8">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
          }}
          className="flex-none rounded-md"
          aria-label="CareFrame, back to the top"
        >
          <Logo size="md" />
        </a>

        <nav aria-label="On this page" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => onLink(e, link.id)}
                  className="rounded-sm text-md text-oat-700 underline decoration-transparent underline-offset-[6px] transition-[color,text-decoration-color] duration-fast hover:text-teal-800 hover:decoration-teal-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2.5 lg:ml-0">
          {signedIn && (
            <Button variant="secondary" className="cfh-press hidden sm:inline-flex" onClick={() => navigate(WORKSPACE_PATH)}>
              Open workspace
            </Button>
          )}
          <Button
            className={cn('cfh-press', heroActionsVisible && 'max-lg:hidden')}
            onClick={startAssessment}
          >
            {START_LABEL}
          </Button>
        </div>
      </Container>
    </header>
  );
};
