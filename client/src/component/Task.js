import dayjs from 'dayjs';

const isToday =  (task) => {
    const comparisonTemplate = 'YYYY-MM-DD';
    const now = dayjs();
    return task.deadline && (task.deadline.format(comparisonTemplate) === now.format(comparisonTemplate));
}

const isYesterday = (task) => {
    const comparisonTemplate = 'YYYY-MM-DD';
    const yesterday = dayjs().subtract(1, 'day');
    return task.deadline && (task.deadline.format(comparisonTemplate) === yesterday.format(comparisonTemplate));
}

const isTomorrow = (task) => {
    const comparisonTemplate = 'YYYY-MM-DD';
    const tomorrow = dayjs().add(1, 'day');
    return task.deadline && (task.deadline.format(comparisonTemplate) === tomorrow.format(comparisonTemplate));
} 

const isNextWeek = (task) => {
     const tomorrow = dayjs().add(1, 'day');
     const nextWeek = dayjs().add(7, 'day');
     const ret = task.deadline && ( !task.deadline.isBefore(tomorrow,'day') && !task.deadline.isAfter(nextWeek,'day') );
     return ret;
}

const isImportant = (task) => {
    return task.isImportant;
}

const isPrivate = (task) => {
    return task.isPrivate;
}

export function formatDeadline(task)
{
    if(!task.deadline) return '--o--';
    else if(isToday(task)) {
        return task.deadline.format('[Today at] HH:mm');
    } else if(isTomorrow(task)) {
        return task.deadline.format('[Tomorrow at] HH:mm');
    } else if(isYesterday(task)) {
        return task.deadline.format('[Yesterday at] HH:mm');
    } else {
        return task.deadline.format('dddd DD MMMM YYYY [at] HH:mm');
    }
}

export function filterAll(list)
{
    return list.filter( () => true);
}

export function filterByImportant(list)
{   
    return list.filter((task) => isImportant(task));
}

export function filterByToday(list)
{
    return list.filter( (task) => isToday(task) );
}

export function filterByNextWeek(list)
{
    return list.filter( (task) => isNextWeek(task) );
}

export function filterByPrivate(list)
{
    return list.filter( (task) => isPrivate(task) );
}