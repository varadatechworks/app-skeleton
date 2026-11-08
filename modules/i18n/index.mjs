export function translate(dictionary,locale,key,variables={},{fallback='en'}={}){
 if(typeof key!=='string'||!key)throw new Error('Translation key required');
 let value=dictionary?.[locale]?.[key]??dictionary?.[fallback]?.[key];if(typeof value!=='string')return key;
 return value.replace(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g,(_,variable)=>Object.hasOwn(variables,variable)?String(variables[variable]):`{${variable}}`);
}
export const baselineMessages={en:{save:'Save',cancel:'Cancel',pending:'Pending',approved:'Approved',dashboard:'Dashboard'},kn:{save:'ಉಳಿಸಿ',cancel:'ರದ್ದುಮಾಡಿ',pending:'ಬಾಕಿಯಿದೆ',approved:'ಅನುಮೋದಿಸಲಾಗಿದೆ',dashboard:'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್'}};
