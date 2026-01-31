// TeamMail Content Script - Gmail Integration
// Injects team collaboration features into Gmail interface

console.log('TeamMail: Extension loaded');

let isTeamMailActive = false;
let currentEmailId = null;
let commentSidebar = null;

// Gmail selectors (these may need updates as Gmail changes)
const GMAIL_SELECTORS = {
  emailThread: '[data-thread-id]',
  emailMessage: '[data-legacy-thread-id]',
  toolbar: '[data-tooltip="Show details"]',
  messageContainer: '.ii.gt'
};

// Initialize TeamMail when Gmail loads
function initTeamMail() {
  console.log('TeamMail: Initializing...');
  
  // Wait for Gmail to load
  const checkGmailLoaded = setInterval(() => {
    if (document.querySelector(GMAIL_SELECTORS.toolbar)) {
      clearInterval(checkGmailLoaded);
      setupTeamMail();
    }
  }, 1000);
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
  // Find Gmail toolbar
  const toolbar = document.querySelector(GMAIL_SELECTORS.toolbar);
  if (!toolbar || document.querySelector('#teammail-comment-btn')) return;
  
  // Create comment button
  const commentButton = document.createElement('div');
  commentButton.id = 'teammail-comment-btn';
  commentButton.innerHTML = `
    <button class="teammail-btn" title="Add team comment">
      💬 Comment
    </button>
  `;
  
  commentButton.addEventListener('click', toggleCommentSidebar);
  
  // Insert button near toolbar
  const parentContainer = toolbar.closest('.ar9');
  if (parentContainer) {
    parentContainer.appendChild(commentButton);
  }
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTeamMail);
} else {
  initTeamMail();
}