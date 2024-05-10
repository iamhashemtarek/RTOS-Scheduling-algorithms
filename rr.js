function createTask(name, releaseTime, period, executionTime, deadline, maxTime) {
    return {
        name,
        releaseTime,
        period,
        executionTime,
        deadline,
        maxTime,
        remainingTime: executionTime,
        nextDueTime: releaseTime,
        executionLogs: []
    };
}

function roundRobinScheduler(tasks, timeQuantum) {
    console.log("Starting Round-Robin Scheduler...");
    let currentTime = 0;
    const readyQueue = [];

    // Initialize the ready queue
    tasks.forEach(task => {
        if (task.releaseTime <= currentTime) {
            readyQueue.push(task);
        }
    });

    while (readyQueue.length > 0 || tasks.some(task => task.nextDueTime <= task.maxTime)) {
        // Load new tasks into the queue
        tasks.forEach(task => {
            if (task.nextDueTime <= currentTime && !readyQueue.includes(task) && task.nextDueTime <= task.maxTime) {
                readyQueue.push(task);
            }
        });

        if (readyQueue.length === 0) {
            currentTime++;
            continue;
        }

        const task = readyQueue.shift();
        const startTime = Math.max(currentTime, task.nextDueTime);
        const runTime = Math.min(timeQuantum, task.remainingTime);
        const endTime = startTime + runTime;

        console.log(`${task.name} starts execution at ${startTime}`);
        task.executionLogs.push([startTime, endTime]);
        task.remainingTime -= runTime;
        currentTime = endTime;

        console.log(`${task.name} finishes execution at ${endTime}`);

        // Reschedule the task if it still has time remaining and is not past maxTime
        if (task.remainingTime > 0 && currentTime < task.maxTime) {
            task.nextDueTime += task.period;
            if (task.nextDueTime <= task.maxTime) {
                readyQueue.push(task);
            }
        } else if (task.remainingTime <= 0) {
            task.nextDueTime += task.period;
            task.remainingTime = task.executionTime; // Reset remaining time for the next period
            if (task.nextDueTime <= task.maxTime) {
                readyQueue.push(task);
            }
        }
    }

    console.log("All tasks have been executed.");
}

function printResults(tasks) {
    console.log("\nTask Execution Summary:");
    tasks.forEach(task => {
        console.log(`${task.name} execution intervals: ${JSON.stringify(task.executionLogs)}`);
    });
}

// Example tasks and time quantum
const timeQuantum = 3;  // Time quantum of 3 units
const tasks = [
    createTask("Task 1", 0, 5, 6, 2, 20),
    createTask("Task 2", 2, 7, 8, 3, 20),
    createTask("Task 3", 1, 6, 10, 5, 20)
];

roundRobinScheduler(tasks, timeQuantum);
printResults(tasks);
