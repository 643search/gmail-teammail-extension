// TeamMail Background Script (Service Worker)

console.log('TeamMail background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    console.log('TeamMail installed');
    
    // Set default settings
    chrome.storage.sync.set({
      teammail_enabled: true,
      notifications_enabled: true,
      keyboard_shortcuts: true
    });
    
    // Don't open welcome page for MVP
    console.log('TeamMail: Installation complete');
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('TeamMail background received message:', request);
  
  switch (request.action) {
    case 'get-user-info':
      // TODO: Get user authentication info
      sendResponse({user: 'demo@example.com'});
      break;
      
    case 'save-comment':
      // TODO: Save comment to backend
      console.log('Saving comment:', request.comment);
      sendResponse({success: true});
      break;
      
    case 'load-comments':
      // TODO: Load comments from backend
      console.log('Loading comments for:', request.emailId);
      sendResponse({comments: []});
      break;
      
    default:
      sendResponse({error: 'Unknown action'});
  }
  
  return true; // Keep message channel open for async response
});

// Handle toggle-comments from popup (separate listener)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'toggle-comments') {
    // Forward to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, request);
      }
    });
    return true;
  }
});

// Badge management (simplified for MVP)
function updateBadge(tabId, commentCount) {
  // TODO: Implement badge functionality later
  console.log('TeamMail: Badge update requested for tab:', tabId, 'count:', commentCount);
}

// Tab change handling (simplified for MVP)
chrome.tabs.onActivated.addListener(function(activeInfo) {
  console.log('TeamMail: Tab activated:', activeInfo.tabId);
  // TODO: Add badge functionality later
});