/*
  Similarity Check Utility
  This function checks if a new issue title is similar to existing issues.
  It uses a simple string matching approach - no AI needed!
  
  How it works:
  1. Convert both titles to lowercase
  2. Check if one title contains most words from the other
  3. If similarity score > 60%, we consider it a similar issue
*/

// Function to calculate similarity between two strings
export function checkSimilarIssues(newIssueTitle, existingIssues) {
  // Convert title to lowercase and split into words
  const newWords = newIssueTitle.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  
  // If title is too short, skip checking
  if (newWords.length === 0) {
    return [];
  }

  // Find all issues that might be similar
  const similarIssues = existingIssues.filter((issue) => {
    const existingWords = issue.title.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    
    // Count how many words match
    let matchCount = 0;
    for (let word of newWords) {
      if (existingWords.some(eWord => eWord.includes(word) || word.includes(eWord))) {
        matchCount++;
      }
    }
    
    // Calculate similarity percentage
    const similarity = (matchCount / Math.max(newWords.length, existingWords.length)) * 100;
    
    // Return issue if similarity is > 60%
    return similarity > 60;
  });

  return similarIssues;
}
