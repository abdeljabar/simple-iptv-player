document.getElementById('validate-file').addEventListener('click', async () => {
  const filePath = document.getElementById('file-path').value.trim();
  if (!filePath) {
    alert('Please enter a file path.');
    return;
  }

  const result = await window.electronAPI.validateFilePath(filePath);

  if (result.error) {
    alert(result.error);
    return;
  }

  const parsedData = parsePlaylist(result.content);
  displayContent(parsedData);
});

function parsePlaylist(content) {
  const lines = content.split('\n');
  const categories = { channels: [], series: [], movies: [] };

  lines.forEach((line, index) => {
    if (line.startsWith('#EXTINF')) {
      const nextLine = lines[index + 1];
      if (line.includes('type=movie')) {
        categories.movies.push({ title: extractTitle(line), url: nextLine });
      } else if (line.includes('type=series')) {
        categories.series.push({ title: extractTitle(line), url: nextLine });
      } else {
        categories.channels.push({ title: extractTitle(line), url: nextLine });
      }
    }
  });

  return categories;
}

function extractTitle(infoLine) {
  const titleMatch = infoLine.match(/,(.+)$/);
  return titleMatch ? titleMatch[1] : 'Unknown';
}

function displayContent(data) {
  populateList('channel-list', data.channels);
  populateList('series-list', data.series);
  populateList('movie-list', data.movies);
}

function populateList(elementId, items) {
  const listElement = document.getElementById(elementId);
  listElement.innerHTML = '';

  items.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = item.title;
    listItem.dataset.url = item.url;
    listItem.addEventListener('click', () => openVideo(item.url));
    listElement.appendChild(listItem);
  });
}

// Open video in an external player
function openVideo(url) {
  if (url) {
      window.electronAPI.openRemoteVideo(url);
  } else {
    alert('No valid URL to open.');
  }
}
