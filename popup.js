// TeamMail Popup Script
document.addEventListener('DOMContentLoaded', function() {
  
  // Check if we're on Gmail
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    const isGmail = currentTab.url && currentTab.url.includes('mail.google.com');
    
    const statusElement = document.getElementById('status');
    const statusText = document.getElementById('status-text');
    const openCommentsBtn = document.getElementById('open-comments');
    
    if (isGmail) {
      statusElement.className = 'status';
      statusText.textContent = 'Ready to collaborate!';
      openCommentsBtn.disabled = false;
    } else {
      statusElement.className = 'status inactive';
      statusText.textContent = 'Open Gmail to use TeamMail';
      openCommentsBtn.disabled = true;
    }
  });
  
  // Open comments button
  document.getElementById('open-comments').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'toggle-comments'});
      window.close();
    });
  });
  
  // View team button
  document.getElementById('view-team').addEventListener('click', function() {
    // TODO: Open team management page
    chrome.tabs.create({
      url: 'https://teammail.io/team' // Will be our actual webapp URL
    });
  });
  
});