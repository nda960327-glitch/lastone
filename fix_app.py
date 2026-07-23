import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the first chunk
target1 = "      if (oxC3) { oxC3.style.display = 'flex'; oxC3.classList.remove('hidden'); }"
replace1 = """      if (oxC3) { 
        if (isSwipeMode) {
          oxC3.style.display = 'none';
          oxC3.classList.add('hidden');
        } else {
          oxC3.style.display = 'flex'; 
          oxC3.classList.remove('hidden');
        }
      }"""
content = content.replace(target1, replace1)

# Replace the second chunk
target2 = """    swipeToggle.addEventListener('change', (e) => {
      isSwipeMode = e.target.checked;
      if (!isSwipeMode && testCard) {
        testCard.style.transform = '';
        testCard.style.boxShadow = '';
        testCard.classList.remove('dragging');
      }
    });"""
replace2 = """    swipeToggle.addEventListener('change', (e) => {
      isSwipeMode = e.target.checked;
      if (!isSwipeMode && testCard) {
        testCard.style.transform = '';
        testCard.style.boxShadow = '';
        testCard.classList.remove('dragging');
      }

      const oxC = document.getElementById('ox-buttons-container');
      const btnReveal = document.getElementById('btn-reveal');
      if (oxC && btnReveal) {
        if (isSwipeMode) {
          oxC.style.display = 'none';
          oxC.classList.add('hidden');
        } else {
          if (btnReveal.classList.contains('hidden') && document.getElementById('test-meanings') && !document.getElementById('test-meanings').classList.contains('hidden')) {
            oxC.style.display = 'flex';
            oxC.classList.remove('hidden');
          }
        }
      }
    });"""

content = content.replace(target2, replace2)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)
