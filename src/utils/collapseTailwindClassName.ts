export const collapseTailwindClassName = (className: string | string[] = '') => {
  const classLists = Array.isArray(className) ? className.map(c => c.trim().split(' ')).flat() : className.trim().split(' ');
  const classMap: Record<string, string> = {};
  const baseClass = classLists.join(' ').split(' ').filter(className => !className.includes('-')).join(' ');

  classLists.forEach((classList) => {
    classList.split(' ').filter(className => className.includes('-')).forEach((className) => {
      const [base, modifier] = className.split('-').length > 2 ? [
          className.substring(0, className.lastIndexOf('-')),
          className.split('-')[-1]
      ]: className.split('-')
      if (modifier) {
        classMap[base] = className; // 덮어쓰기
      } else {
        classMap[className] = className;
      }
    });
  });

  return Object.values(classMap).join(' ') + ' ' + baseClass;
}