const PREFIX='linasopti_clean_';
export const state={get(k,f=null){try{const v=localStorage.getItem(PREFIX+k);return v===null?f:JSON.parse(v)}catch{return f}},set(k,v){localStorage.setItem(PREFIX+k,JSON.stringify(v));return v},remove(k){localStorage.removeItem(PREFIX+k)}};
