// TeamMail Content Script - Gmail Integration
// Injects team collaboration features into Gmail interface

console.log('TeamMail: Extension loaded');

let isTeamMailActive = false;
let currentEmailId = null;
let commentSidebar = null;

// Gmail selectors (multiple fallbacks for different Gmail layouts)
const GMAIL_SELECTORS = {
  emailThread: '[data-thread-id]',
  emailMessage: '[data-legacy-thread-id]', 
  toolbar: '[data-tooltip="Show details"]',
  messageContainer: '.ii.gt',
  replyToolbar: '[data-tooltip="Reply"]',
  bottomToolbar: '.amn',
  topToolbar: '.ar9',
  emailActions: '.adf'
};

// Initialize TeamMail when Gmail loads
function initTeamMail() {
  console.log('TeamMail: Initializing...');
  
  // Try to setup immediately
  setupTeamMail();
  
  // Also wait for Gmail to fully load and retry
  let attempts = 0;
  const maxAttempts = 10;
  
  const checkGmailLoaded = setInterval(() => {
    attempts++;
    console.log(`TeamMail: Setup attempt ${attempts}/${maxAttempts}`);
    
    setupTeamMail();
    
    if (attempts >= maxAttempts || document.querySelector('#teammail-comment-btn')) {
      clearInterval(checkGmailLoaded);
      console.log('TeamMail: Setup complete or max attempts reached');
    }
  }, 2000);
}

// Set up TeamMail features
function setupTeamMail() {
  console.log('TeamMail: Setting up features...');
  
  // Create comment button
  createCommentButton();
  
  // Set up observers for email changes
  setupEmailObserver();
  
  // Set up keyboard shortcuts
  setupKeyboardShortcuts();
}

// Create the main comment button
function createCommentButton() {
  if (document.querySelector('#teammail-comment-btn')) {
    console.log('TeamMail: Comment button already exists');
    return;
  }
  
  console.log('TeamMail: Attempting to create comment button...');
  
  // Try multiple injection points
  let injectionPoint = null;
  
  // Method 1: Try bottom toolbar (near Reply/Forward buttons)
  const bottomToolbar = document.querySelector(GMAIL_SELECTORS.bottomToolbar);
  if (bottomToolbar) {
    console.log('TeamMail: Found bottom toolbar');
    injectionPoint = bottomToolbar;
  }
  
  // Method 2: Try top toolbar area
  if (!injectionPoint) {
    const topToolbar = document.querySelector(GMAIL_SELECTORS.topToolbar);
    if (topToolbar) {
      console.log('TeamMail: Found top toolbar');
      injectionPoint = topToolbar;
    }
  }
  
  // Method 3: Try email actions area
  if (!injectionPoint) {
    const emailActions = document.querySelector(GMAIL_SELECTORS.emailActions);
    if (emailActions) {
      console.log('TeamMail: Found email actions');
      injectionPoint = emailActions;
    }
  }
  
  // Method 4: Fallback - inject into body with fixed position
  if (!injectionPoint) {
    console.log('TeamMail: Using fallback injection to body');
    injectionPoint = document.body;
  }
  
  // Create comment button
  const commentButton = document.createElement('div');
  commentButton.id = 'teammail-comment-btn';
  commentButton.style.cssText = `
    display: inline-block;
    margin: 8px;
    z-index: 1000;
    position: relative;
  `;
  commentButton.innerHTML = `
    <button class="teammail-btn" title="Add team comment" style="
      background: #4285f4;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-family: 'Google Sans', Roboto, sans-serif;
    ">
      💬 TeamMail
    </button>
  `;
  
  commentButton.addEventListener('click', toggleCommentSidebar);
  
  // Insert button
  injectionPoint.appendChild(commentButton);
  console.log('TeamMail: Comment button created and inserted');
}

// Toggle comment sidebar
function toggleCommentSidebar() {
  if (commentSidebar) {
    closeCommentSidebar();
  } else {
    openCommentSidebar();
  }
}

// Open comment sidebar
function openCommentSidebar() {
  console.log('TeamMail: Opening comment sidebar...');
  
  // Get current email ID
  currentEmailId = extractEmailId();
  if (!currentEmailId) {
    console.log('TeamMail: Could not extract email ID');
    return;
  }
  
  // Create sidebar
  commentSidebar = document.createElement('div');
  commentSidebar.id = 'teammail-sidebar';
  commentSidebar.innerHTML = `
    <div class="teammail-sidebar-header">
      <h3>Team Comments</h3>
      <button id="teammail-close-btn">&times;</button>
    </div>
    <div class="teammail-comments-container">
      <div class="teammail-no-comments">
        No comments yet. Be the first to add one!
      </div>
    </div>
    <div class="teammail-add-comment">
      <textarea placeholder="Add a comment..." id="teammail-comment-input"></textarea>
      <div class="teammail-comment-actions">
        <button id="teammail-post-btn" class="teammail-btn-primary">Post Comment</button>
        <button id="teammail-mention-btn" class="teammail-btn-secondary">@Mention</button>
      </div>
    </div>
  `;
  
  // Add event listeners
  commentSidebar.querySelector('#teammail-close-btn').addEventListener('click', closeCommentSidebar);
  commentSidebar.querySelector('#teammail-post-btn').addEventListener('click', postComment);
  commentSidebar.querySelector('#teammail-mention-btn').addEventListener('click', showMentionOptions);
  
  // Insert sidebar
  document.body.appendChild(commentSidebar);
  
  // Load existing comments
  loadComments(currentEmailId);
  
  isTeamMailActive = true;
}

// Close comment sidebar
function closeCommentSidebar() {
  if (commentSidebar) {
    commentSidebar.remove();
    commentSidebar = null;
    isTeamMailActive = false;
  }
}

// Extract email ID from Gmail DOM
function extractEmailId() {
  // Try multiple methods to get a unique email identifier
  const threadElement = document.querySelector(GMAIL_SELECTORS.emailThread);
  if (threadElement) {
    return threadElement.getAttribute('data-thread-id');
  }
  
  // Fallback to URL parsing
  const urlMatch = window.location.href.match(/\/mail\/u\/\d+\/#inbox\/([A-Za-z0-9]+)/);
  if (urlMatch) {
    return urlMatch[1];
  }
  
  // Generate temporary ID based on email content
  const messageContainer = document.querySelector(GMAIL_SELECTORS.messageContainer);
  if (messageContainer) {
    const emailContent = messageContainer.textContent.substring(0, 100);
    return btoa(emailContent).substring(0, 16);
  }
  
  return null;
}

// Post a comment
function postComment() {
  const commentInput = document.querySelector('#teammail-comment-input');
  const comment = commentInput.value.trim();
  
  if (!comment) return;
  
  console.log('TeamMail: Posting comment:', comment);
  
  // TODO: Send to backend API
  // For now, just show locally
  addCommentToSidebar({
    id: Date.now(),
    text: comment,
    author: 'You',
    timestamp: new Date().toLocaleTimeString()
  });
  
  commentInput.value = '';
}

// Add comment to sidebar display
function addCommentToSidebar(comment) {
  const container = document.querySelector('.teammail-comments-container');
  const noComments = container.querySelector('.teammail-no-comments');
  
  if (noComments) {
    noComments.remove();
  }
  
  const commentElement = document.createElement('div');
  commentElement.className = 'teammail-comment';
  commentElement.innerHTML = `
    <div class="teammail-comment-header">
      <strong>${comment.author}</strong>
      <span class="teammail-comment-time">${comment.timestamp}</span>
    </div>
    <div class="teammail-comment-text">${comment.text}</div>
  `;
  
  container.appendChild(commentElement);
}

// Load existing comments
function loadComments(emailId) {
  console.log('TeamMail: Loading comments for email:', emailId);
  
  // TODO: Load from backend API
  // For now, show demo comment
  setTimeout(() => {
    addCommentToSidebar({
      id: 1,
      text: 'Welcome to TeamMail! This is a demo comment.',
      author: 'TeamMail',
      timestamp: new Date().toLocaleTimeString()
    });
  }, 500);
}

// Show mention options
function showMentionOptions() {
  console.log('TeamMail: Showing mention options');
  // TODO: Implement @mention dropdown
  alert('@Mention feature coming soon!');
}

// Set up observer for email changes
function setupEmailObserver() {
  const observer = new MutationObserver((mutations) => {
    // Check if we've navigated to a different email
    const newEmailId = extractEmailId();
    if (newEmailId !== currentEmailId && isTeamMailActive) {
      currentEmailId = newEmailId;
      loadComments(currentEmailId);
    }
    
    // Re-add comment button if it disappeared
    if (!document.querySelector('#teammail-comment-btn')) {
      setTimeout(createCommentButton, 1000);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Set up keyboard shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Shift + C to toggle comments
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      toggleCommentSidebar();
    }
  });
}

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('TeamMail: Received message:', request);
  
  if (request.action === 'toggle-comments') {
    toggleCommentSidebar();
    sendResponse({success: true});
  }
  
  return true;
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTeamMail);
} else {
  initTeamMail();
}

// Also try after a delay for Gmail's dynamic loading
setTimeout(initTeamMail, 3000);
setTimeout(initTeamMail, 6000);