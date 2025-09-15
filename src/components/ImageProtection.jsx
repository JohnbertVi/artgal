import { useEffect } from 'react';

/**
 * ImageProtection component adds robust security measures to prevent:
 * 1. Right-click context menu on images
 * 2. Drag-and-drop of images
 * 3. Selection of images
 * 4. Screenshot attempts through multiple layers of protection
 */
const ImageProtection = () => {
  useEffect(() => {
    // Set up screenshot detection variables
    let screenshotAttemptCount = 0;
    
    // Helper function to activate protection
    const activateProtection = (message, showAlert = false) => {
      screenshotAttemptCount++;

      // Make watermark more visible briefly
      document.querySelectorAll('.art-watermark').forEach(watermark => {
        // Prepare tiled SVG background using the watermark text so screenshots include repeated watermark
        const text = (watermark.textContent || watermark.dataset.text || '').trim();
        if (text) {
          watermark.dataset.orig = watermark.textContent;
          // create small SVG with the watermark text
          const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='80'><rect width='100%' height='100%' fill='rgba(0,0,0,0)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='rgba(255,255,255,0.18)' font-weight='700'>${text}</text></svg>`;
          const encoded = encodeURIComponent(svg);
          watermark.style.backgroundImage = `url("data:image/svg+xml;utf8,${encoded}")`;
          watermark.style.backgroundRepeat = 'repeat';
          watermark.style.backgroundPosition = '0 0';
          watermark.style.backgroundSize = '240px 80px';
          watermark.classList.add('watermark-tiled');
          // hide textual content (keeps text in dataset)
          watermark.textContent = '';
        }

        // Emphasize center watermark as well
        watermark.classList.add('watermark-visible');
      });

      // Show a transient overlay message on top of artworks (no blur)
      document.querySelectorAll('.art-overlay').forEach(overlay => {
        // Put an icon + message in the overlay
        overlay.innerHTML = `<span class="protect-icon">⚠</span><span class="protect-text">${message}</span>`;
        overlay.classList.add('protection-visible');
        setTimeout(() => {
          overlay.classList.remove('protection-visible');
          overlay.innerHTML = '';
        }, 2200);
      });

      // only show a browser alert for extreme repeated attempts if explicitly requested
      if (showAlert && screenshotAttemptCount > 6) {
        try { window.alert(message + ' - Please stop attempts to copy artwork.'); } catch (e) {}
      }

      // revert tiled watermark after a short time
      setTimeout(() => {
        document.querySelectorAll('.art-watermark.watermark-tiled').forEach(watermark => {
          if (watermark.dataset && watermark.dataset.orig !== undefined) {
            watermark.textContent = watermark.dataset.orig;
            delete watermark.dataset.orig;
          }
          watermark.style.backgroundImage = '';
          watermark.style.backgroundRepeat = '';
          watermark.style.backgroundPosition = '';
          watermark.style.backgroundSize = '';
          watermark.classList.remove('watermark-tiled');
          watermark.classList.remove('watermark-visible');
        });
      }, Math.min(screenshotAttemptCount * 3000, 10000));
    };
    
    // Disable right-click
    const handleContextMenu = (e) => {
      if (e.target.tagName === 'IMG' || e.target.closest('.art-container')) {
        e.preventDefault();
        activateProtection('Right-clicking is disabled to protect artwork', false);
        return false;
      }
    };

    // Disable dragging images
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG' || e.target.closest('.art-container')) {
        e.preventDefault();
        activateProtection('Dragging images is disabled', false);
        return false;
      }
    };
    
    // Handle key combinations for screenshots
    const handleKeyDown = (e) => {
      // Detect various screenshot methods
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'c')) || 
        e.key === 'PrintScreen' ||
        (e.shiftKey && e.key === 'S' && (e.metaKey || e.getModifierState('Meta') || e.getModifierState('OS'))) ||
        (e.getModifierState('OS') && e.shiftKey && e.key === 'S')
      ) {
        e.preventDefault();
        e.stopPropagation();
        activateProtection('Screenshot attempt detected', true);
        return false;
      }
    };
    
    // Handle visibility change (tab switching, etc.)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // show watermark briefly but do not blur
        activateProtection('Visibility change detected', false);
      }
    };
    
    // Handle window blur/focus (switching apps)
    const handleWindowBlur = () => {
      activateProtection('Window focus change detected', false);
    };
    
    // Mouse enter/leave for art containers - no blur, just track hover
    const handleMouseEnter = (e) => {
      if (e.target.classList && (e.target.classList.contains('art-container') || e.target.closest('.art-container'))) {
      }
    };
    
    const handleMouseLeave = (e) => {
      if (e.target.classList && (e.target.classList.contains('art-container') || e.target.closest('.art-container'))) {
      }
    };
    
    // Constant random movement of watermark (subtle)
    const moveWatermarks = () => {
      document.querySelectorAll('.art-watermark').forEach(watermark => {
        const angle = (Math.random() * 6) - 3; // Random angle between -3 and 3 degrees
        watermark.style.transform = `rotate(${angle}deg)`;
      });
    };
    
    const watermarkInterval = setInterval(moveWatermarks, 800);
    
    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('visibilitychange', handleVisibilityChange, true);
    window.addEventListener('blur', handleWindowBlur, true);
    
    // Set up mutation observer to monitor for added art-container elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              let containers = [];
              if (node.querySelectorAll) {
                containers = Array.from(node.querySelectorAll('.art-container'));
              }
              if (node.classList && node.classList.contains('art-container')) {
                containers.push(node);
              }
              containers.forEach(container => {
                container.addEventListener('mouseenter', handleMouseEnter);
                container.addEventListener('mouseleave', handleMouseLeave);
              });
            }
          });
        }
      });
    });
    
    // Start observing document for added nodes
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Add existing container listeners
    document.querySelectorAll('.art-container').forEach(container => {
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    });

    // Add CSS for protection mechanisms
    const style = document.createElement('style');
    style.innerHTML = `
      img {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
      }
      
      .art-container {
        position: relative;
        overflow: hidden;
      }
      
      .art-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 40;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: 700;
        font-size: 1.05rem;
        opacity: 0;
        transition: opacity 220ms ease-in-out, transform 220ms ease-in-out;
        transform: translateY(6px);
      }
      
      .art-overlay.protection-visible {
        opacity: 1;
        transform: translateY(0);
        background: rgba(0,0,0,0.45);
        color: #fff;
        text-align: center;
        padding: 0.75rem 1rem;
        pointer-events: none;
      }

      .art-overlay .protect-icon {
        margin-right: 0.6rem;
        font-size: 1.2rem;
        display: inline-block;
        vertical-align: middle;
      }
      .art-overlay .protect-text {
        display: inline-block;
        vertical-align: middle;
        font-size: 1rem;
      }
      
      .art-image {
        transition: transform 0.2s ease-in-out;
      }
      
      /* keep watermark subtle by default */
      .art-watermark {
        z-index: 30;
        transition: opacity 0.3s ease, transform 0.5s ease, background 0.3s ease;
        opacity: 0.35;
        font-size: 1.6rem;
        color: rgba(211,47,47,0.9);
        font-weight: 700;
        position: absolute;
        left: 0;
        top: 50%;
        width: 100%;
        text-align: center;
        pointer-events: none;
        padding: 0 6px;
      }
      
      .art-watermark.watermark-tiled {
        color: transparent !important;
        background-repeat: repeat !important;
        background-position: 0 0 !important;
        background-size: 240px 80px !important;
      }
      
      .watermark-visible {
        opacity: 0.9 !important;
        font-size: 2rem !important;
      }
      
      /* Remove grid pattern overlay from .art-container::before */
      .art-container::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 15;
        background: none !important;
      }
    `;
    document.head.appendChild(style);

    // Clean up function
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange, true);
      window.removeEventListener('blur', handleWindowBlur, true);
      
      document.querySelectorAll('.art-container').forEach(container => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      });
      
      clearInterval(watermarkInterval);
      observer.disconnect();
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

export default ImageProtection;
