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
    let lastBlurTime = 0;
    let isMouseOnImage = false;
    
    // Helper function to activate protection
    const activateProtection = (message, showAlert = false) => {
      screenshotAttemptCount++;
      
      // Make all art images protected
      document.querySelectorAll('.art-image').forEach(img => {
        img.classList.add('art-protected');
        // Keep protection for a variable amount of time based on attempts
        setTimeout(() => {
          if (!isMouseOnImage) {
            img.classList.remove('art-protected');
          }
        }, Math.min(screenshotAttemptCount * 5000, 30000)); // Increase protection time with attempts
      });
      
      // Add watermark overlay at higher opacity
      document.querySelectorAll('.art-watermark').forEach(watermark => {
        watermark.classList.add('watermark-visible');
        setTimeout(() => {
          watermark.classList.remove('watermark-visible');
        }, Math.min(screenshotAttemptCount * 5000, 30000));
      });
      
      if (showAlert && screenshotAttemptCount > 3) {
        alert(message + " - Protection measures intensified.");
      }
      
      lastBlurTime = Date.now();
    };
    
    // Disable right-click
    const handleContextMenu = (e) => {
      if (e.target.tagName === 'IMG' || e.target.closest('.art-container')) {
        e.preventDefault();
        activateProtection("Right-clicking is disabled to protect artwork", false);
        return false;
      }
    };

    // Disable dragging images
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG' || e.target.closest('.art-container')) {
        e.preventDefault();
        activateProtection("Dragging images is disabled", false);
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
        activateProtection("Screenshot attempt detected", true);
        return false;
      }
    };
    
    // Handle visibility change (tab switching, etc.)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        activateProtection("Visibility change detected", false);
      }
    };
    
    // Handle window blur/focus (switching apps)
    const handleWindowBlur = () => {
      activateProtection("Window focus change detected", false);
    };
    
    // Mouse enter/leave for art containers
    const handleMouseEnter = (e) => {
      if (e.target.classList.contains('art-container') || e.target.closest('.art-container')) {
        isMouseOnImage = true;
        const imageEl = e.target.querySelector('.art-image') || e.target.closest('.art-container').querySelector('.art-image');
        if (imageEl && Date.now() - lastBlurTime > 3000) {
          imageEl.classList.remove('art-protected');
        }
      }
    };
    
    const handleMouseLeave = (e) => {
      if (e.target.classList.contains('art-container') || e.target.closest('.art-container')) {
        isMouseOnImage = false;
        const imageEl = e.target.querySelector('.art-image') || e.target.closest('.art-container').querySelector('.art-image');
        if (imageEl) {
          imageEl.classList.add('art-protected');
          // Only remove protection after a delay and if protection is no longer needed
          setTimeout(() => {
            if (!isMouseOnImage && Date.now() - lastBlurTime > 5000) {
              imageEl.classList.remove('art-protected');
            }
          }, 1000);
        }
      }
    };
    
    // Constant random movement of watermark
    const moveWatermarks = () => {
      document.querySelectorAll('.art-watermark').forEach(watermark => {
        const angle = Math.random() * 10 - 5; // Random angle between -5 and 5 degrees
        watermark.style.transform = `rotate(${angle}deg)`;
      });
    };
    
    const watermarkInterval = setInterval(moveWatermarks, 500);
    
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
        z-index: 10;
        pointer-events: none;
      }
      
      .art-image {
        transition: all 0.2s ease-in-out;
      }
      
      .art-protected {
        filter: blur(20px) brightness(0.7) !important;
      }
      
      .art-watermark {
        z-index: 30;
        transition: opacity 0.3s ease, transform 0.5s ease;
      }
      
      .watermark-visible {
        opacity: 0.9 !important;
        font-size: 150% !important;
      }
      
      /* Create a dynamic grid pattern overlay */
      .art-container::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: repeating-linear-gradient(
          0deg,
          rgba(255,255,255,0.1) 0px,
          rgba(255,255,255,0.1) 1px,
          transparent 1px,
          transparent 10px
        ),
        repeating-linear-gradient(
          90deg,
          rgba(255,255,255,0.1) 0px,
          rgba(255,255,255,0.1) 1px,
          transparent 1px,
          transparent 10px
        );
        pointer-events: none;
        z-index: 15;
      }
      
      /* Add protection for modal/popup images as well */
      .swal2-popup .art-container::after {
        content: "Protected Artwork";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255,255,255,0.8);
        font-size: 2vw;
        font-weight: bold;
        text-shadow: 0 0 5px black;
        background-color: rgba(0,0,0,0.3);
        z-index: 25;
        pointer-events: none;
        opacity: 0.5;
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
