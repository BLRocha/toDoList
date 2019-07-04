const $createTask = document.querySelector('[placeholder="Create Task"]');
const $actionTask = [...document.querySelectorAll('[data-await="awaitTasks"]')];

const globals = {
  keyTimeout: '',
};

$createTask.addEventListener('keyup', evt => {
  if (evt.keyCode == 13 && $createTask.value.length >= 3) {
    const createAt = new Date().toLocaleString();
    boxModelTask($createTask.value, 'CRIAÇÀO: '+
      createAt);
    $createTask.value = '';
    $createTask.focus;
    saveInterval();
  }
});

$actionTask.forEach(taskListener => {
  taskListener.addEventListener('click', taskAction => {
    const nodes = taskAction.target.parentNode;
    switch (taskAction.target.id) {
      case 'erase':
        nodes.parentNode.removeChild(nodes);
        setTimeout(pendingStorage, 2000);
        break;
      case 'finished':
        const finishedAt = ' - FINALIZADA: '+new Date().toLocaleString();
        taskDone(nodes, finishedAt);
        saveInterval();
        break;
      default:
        console.log('err');
        break;
    };
  });
});

const boxModelTask = (descTask, date, noStorage=true) => {
  if (noStorage) {
    const $listTasks = document.querySelector('[data-await="awaitTasks"]');
    
    const div = document.createElement('div');
    const btnFinished = document.createElement('button');
    const btnErase = document.createElement('button');
    const span = document.createElement('span');

    span.appendChild(document.createTextNode(date))
    btnFinished.setAttribute('id', 'finished');
    btnErase.setAttribute('id', 'erase');

    btnFinished.appendChild(document.createTextNode('Feito'));
    btnErase.appendChild(document.createTextNode('Excluir'));

    div.setAttribute('class', 'taskStyles pending');
    div.appendChild(document.createTextNode(descTask));
    div.appendChild(span);
    div.appendChild(btnFinished);
    div.appendChild(btnErase);

    $listTasks.appendChild(div);
    return 0;
  }
  const $listTasks = document.querySelector('[data-done="doneTasks"]');
  const div = document.createElement('div');
  const span = document.createElement('span');
  span.appendChild(document.createTextNode(date));
  div.setAttribute('class', 'taskStyles pending');
  div.appendChild(document.createTextNode(descTask));
  div.appendChild(span);
  div.classList.toggle('pending');
  $listTasks.appendChild(div)
  return 0;
}

const taskDone = (descTask, data) => {
  const $taskFinished = document.querySelector('[data-done="doneTasks"]');
  const updateAt = descTask.querySelector('span');
  const updateTaskAT = document.createTextNode(data);
  for (let i = 0; i < 2; i++) {
    let lastButtons = descTask.lastChild;
    lastButtons.parentNode.removeChild(lastButtons);
  }
  updateAt.appendChild(updateTaskAT);
  descTask.classList.toggle('pending');
  $taskFinished.appendChild(descTask);
  return 0;
}
// save
const pendingStorage = (save=true) => {
  if (save) {
    let pendingTask = [];
    const $pendingTask = document.querySelectorAll('[data-await="awaitTasks"]');
    $pendingTask.forEach( nodeList => {
      nodeList.querySelectorAll('div').forEach( divs => {
        pendingTask.push({
          text: divs.innerText.split('\n')[0],
          data: divs.querySelector('span').textContent
        });
      });
    });
    window.localStorage.setItem('pending', JSON.stringify(pendingTask));
    return 0;
  };
  const getTask = JSON.parse(window.localStorage.getItem('pending'))
  getTask.forEach(task=> {
    boxModelTask(task.text, task.data);
  });
  return 0;
}
const finishedStorage = (save=true) => {
  if (save) {
    let finishedTask = [];
    const $finishedTask = document.querySelectorAll('[data-done="doneTasks"]');
    $finishedTask.forEach( nodeList => {
      nodeList.querySelectorAll('div').forEach( divs => {
        finishedTask.push({
          text: divs.innerText.split('\n')[0],
          data: divs.querySelector('span').textContent
        });
      });
    });
    window.localStorage.setItem('finished', JSON.stringify(finishedTask));
    return 0;
  };
  const getTask = JSON.parse(window.localStorage.getItem('finished'))
  getTask.forEach(task=> {
    boxModelTask(task.text, task.data, false);
  });
  return 0;
}
document.addEventListener('DOMContentLoaded', () => {
  pendingStorage(false);
  finishedStorage(false);
});

document.querySelectorAll('.actionsOptions, button').forEach(button => {
  button.addEventListener('click', evt => {
    if (evt.target.id === 'dell') {
      const $finishedTask = document.querySelectorAll('[data-done="doneTasks"]');
        $finishedTask.forEach(nodeList => {
          nodeList.querySelectorAll('div').forEach(divs => {
            divs.parentNode.removeChild(divs);    
        });
      });
      window.localStorage.setItem('finished', '[]');
      return 0;
    };
    clearTimeout(globals.keyTimeout);
    document.querySelector('#save').disabled = true;
    finishedStorage();
    return 0;
  });
})

const saveInterval = () => {
  document.querySelector('#save').disabled = false;
  globals.keyTimeout = setTimeout(() => {
    finishedStorage();
    pendingStorage()
    document.querySelector('#save').disabled = true;
  }, 20000);
  return 0;
}