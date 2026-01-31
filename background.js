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
    
    // Open welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL('welcome.html') // TODO: Create welcome page
    });
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

// Badge management
function updateBadge(tabId, commentCount) {
  if (commentCount > 0) {
    chrome.action.setBadgeText({
      text: commentCount.toString(),
      tabId: tabId
    });
    chrome.action.setBadgeBackgroundColor({
      color: '#4285f4',
      tabId: tabId
    });
  } else {
    chrome.action.setBadgeText({
      text: '',
      tabId: tabId
    });
  }
}

// Tab change handling
chrome.tabs.onActivated.addListener(function(activeInfo) {
  // TODO: Update badge for active tab
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    if (tab.url && tab.url.includes('mail.google.com')) {
      // Gmail tab active - could show comment count
      updateBadge(activeInfo.tabId, 0);
    }
  });
});

// Alarm for periodic sync (future feature)
// Temporarily disabled for MVP
// chrome.alarms.onAlarm.addListener(function(alarm) {
//   if (alarm.name === 'sync-comments') {
//     console.log('TeamMail: Syncing comments...');
//     // TODO: Sync comments with backend
//   }
// });

// Set up periodic sync
// chrome.alarms.create('sync-comments', {
//   delayInMinutes: 5,
//   periodInMinutes: 5
// });