import scheduler from 'node-schedule';

async function sheduleAction(timeSettings, callback) {
    await scheduler.scheduleJob(timeSettings, async () => {
        await callback();
    })
}

export default sheduleAction;