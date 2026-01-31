// TeamMail Background Script (Service Worker) - Clean MVP Version

console.log('TeamMail: Background script loaded (clean version)');

// Handle extension installation
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    console.log('TeamMail: Extension installed');
    
    // Set default settings
    chrome.storage.sync.set({
      teammail_enabled: true,
      notifications_enabled: true,
      keyboard_shortcuts: true
    }).then(() => {
      console.log('TeamMail: Settings saved');
    }).catch(err => {
      console.log('TeamMail: Settings error:', err);
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('TeamMail: Background received message:', request);
  
  try {
    switch (request.action) {
      case 'get-user-info':
        sendResponse({user: 'demo@example.com'});
        break;
        
      case 'save-comment':
        console.log('TeamMail: Saving comment:', request.comment);
        sendResponse({success: true});
        break;
        
      case 'load-comments':
        console.log('TeamMail: Loading comments for:', request.emailId);
        sendResponse({comments: []});
        break;
        
      case 'toggle-comments':
        // Forward to content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs && tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'toggle-comments'});
          }
        });
        sendResponse({success: true});
        break;
        
      default:
        sendResponse({error: 'Unknown action'});
    }
  } catch (error) {
    console.log('TeamMail: Background script error:', error);
    sendResponse({error: error.message});
  }
  
  return true; // Keep message channel open for async response
});

console.log('TeamMail: Background script ready');