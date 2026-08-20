import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Google Translate React DOM safety polyfill (prevents blank screen crash on node mutations)
if (typeof window !== 'undefined') {
  if (Node.prototype.removeChild) {
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function (child) {
      if (child.parentNode !== this) {
        return child;
      }
      return originalRemoveChild.apply(this, arguments);
    };
  }

  if (Node.prototype.insertBefore) {
    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function (newNode, referenceNode) {
      if (referenceNode && referenceNode.parentNode !== this) {
        return newNode;
      }
      return originalInsertBefore.apply(this, arguments);
    };
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
