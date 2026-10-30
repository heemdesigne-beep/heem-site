/* Service links retain real project URLs and use the existing project viewer. */
document.querySelectorAll('[data-service-project]').forEach(link=>{
  link.addEventListener('click',event=>{
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const project=Object.values(datasets).flat().find(p=>p.slug===link.dataset.serviceProject);
    if(!project)return;
    event.preventDefault();openProject(project);
  });
});
