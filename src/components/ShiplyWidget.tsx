'use client';

import { useRef } from 'react';
import { getInstance, show, hide, toggle } from 'shiply-sdk';

interface ShiplyWidgetProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Extended interface for debugging purposes
interface ShiplyInstanceWithWidget {
  widget?: {
    widgetElement?: HTMLElement;
    isVisible?: boolean;
  };
}

/**
 * ShiplyWidget - Simple wrapper for init pattern
 * The SDK is initialized at the app level in layout.tsx
 * This component provides a trigger button to show the widget
 */
export default function ShiplyWidget({
  children,
  className,
  style,
}: ShiplyWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Show feedback widget
  const showFeedback = () => {
    console.log('🔍 ShiplyWidget: showFeedback called');
    const instance = getInstance();
    console.log('🔍 ShiplyWidget: getInstance() returned:', instance);
    
    if (instance) {
      console.log('🔍 ShiplyWidget: Calling show()...');
      const instanceWithWidget = instance as unknown as ShiplyInstanceWithWidget;
      console.log('🔍 ShiplyWidget: Widget element before show:', instanceWithWidget.widget?.widgetElement);
      console.log('🔍 ShiplyWidget: Widget isVisible before show:', instanceWithWidget.widget?.isVisible);
      
      show();
      
      // Check after show and force if needed
      setTimeout(() => {
        console.log('🔍 ShiplyWidget: Widget element after show:', instanceWithWidget.widget?.widgetElement);
        console.log('🔍 ShiplyWidget: Widget isVisible after show:', instanceWithWidget.widget?.isVisible);
        console.log('🔍 ShiplyWidget: Widget element display style:', instanceWithWidget.widget?.widgetElement?.style?.display);
        
        // Force the widget to be visible if it's still not showing
        const widget = document.querySelector('#Shiply-widget') as HTMLElement;
        if (widget && widget.style.display !== 'block') {
          console.log('🔧 ShiplyWidget: Forcing widget to be visible...');
          widget.style.setProperty('display', 'block', 'important');
          console.log('✅ ShiplyWidget: Widget forced to be visible');
        }
      }, 100);
    } else {
      console.warn('❌ Shiply SDK not initialized. Make sure init() was called.');
      console.log('🔍 Available global functions:', { getInstance, show, hide, toggle });
    }
  };

  // If custom children provided, clone them with onClick handler
  if (children) {
    return (
      <div
        ref={containerRef}
        className={className}
        style={style}
        onClick={showFeedback}
      >
        {children}
      </div>
    );
  }

  // Default trigger button
  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
    >
      <button
        onClick={showFeedback}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
          zIndex: 9999,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#0056b3';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#007bff';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        💬
      </button>
    </div>
  );
}
