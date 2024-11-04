import { isReturnStatement } from "typescript";
import { IProject, ProjecStatus, UserRole } from "./class/Project";
import { ProjectsManager } from "./class/ProjectsManager";
import { showErrorPopup } from "./popup";

/* function showModal(id: string) 
    {
        const modal = document.getElementById(id)
        
        if (modal && modal instanceof HTMLDialogElement) {
            modal.showModal()
            } else {
                console.warn("The provided modal wasn't found. ID: ", id)
            }
    }

function closeModal(id: string) 
{
    const modal = document.getElementById(id)
    
    if (modal && modal instanceof HTMLDialogElement) {
        modal.close()
        } else {
            console.warn("The provided modal wasn't found. ID: ", id)
        }
}
*/

function toggleModal(id: string, action: string)
    {
        const modal = document.getElementById(id)
        
        if (modal && modal instanceof HTMLDialogElement) 
            {

            if (action ===  "show") {modal.showModal()}
            else if(action === "close") {modal.close()}
            } 
            
            else {
                console.warn("The provided modal wasn't found. ID: ", id)
            }
    }


const projectListUI = document.getElementById("project-list") as HTMLElement
const projectsManager = new ProjectsManager(projectListUI)


// add DOM objects for button functionality
const newProjectBtn = document.getElementById("new-project-btn");

// ---- FLOW Control 
if (newProjectBtn !== null) {
    newProjectBtn.addEventListener("click", ()=>{toggleModal("new-project-modal", "show")});
} 

else {
    console.warn("New project button not found")
}


const projectForm = document.getElementById("new-project-form")

if (projectForm && projectForm instanceof HTMLFormElement) {
    projectForm.addEventListener("submit", (e)=>{
        e.preventDefault()
        const formData = new FormData(projectForm);
        console.log("Description:", formData.get("description"))
    })
    } else {
        console.warn("The project form wasn't found. Check the ID!")
    }


if (projectForm && projectForm instanceof HTMLFormElement) {

    
    const cancelBtn = document.getElementById("cancel-button")
    
    if(cancelBtn)
        {
            cancelBtn.addEventListener("click", ()=>{
            toggleModal("new-project-modal", "close")
            }) 
        }

   
    projectForm.addEventListener("submit", (e)=>{
        e.preventDefault()
        const formData = new FormData(projectForm);
        const projectData: IProject = {
        name : formData.get("name") as string,
        description : formData.get("description") as string,
        status : formData.get("status") as ProjecStatus,
        userRole : formData.get("userRole") as UserRole,
        finishDate : new Date(formData.get("finishDate") as string)
        }
        
        try{ 
            const project = projectsManager.newProject(projectData)
            projectForm.reset()
            toggleModal("new-project-modal", "close")

        } catch(error){
            /*showErrorPopup(`A project with the name "${formData.get("name")}" already exists`)*/
            toggleModal("new-project-modal", "close")
            

        }
       
    })

    
    } else {
        console.warn("The project form wasn't found. Check the ID!")
    }

if (projectForm && projectForm instanceof HTMLFormElement) {
    
    }


const exportProjectsBtn = document.getElementById("export-projects-btn")
if(exportProjectsBtn) {
    exportProjectsBtn.addEventListener("click", ()=>{
        projectsManager.exportToJson();
    })
}

const importProjectsBtn = document.getElementById("import-projects-btn")
if(importProjectsBtn) {
    importProjectsBtn.addEventListener("click", ()=>{
        projectsManager.importFromJson()
    })
}

/*
// My code - doesnt work
const returnToProjectList = document.getElementById("projects-page-btn")
if(returnToProjectList) {
    returnToProjectList.addEventListener("click", ()=>{
      const projectsPage = document.getElementById("projects-page")
      const detailsPage = document.getElementById("project-details")
      if (!(projectsPage && detailsPage)) { return }
      projectsPage.style.display = "flex"
      detailsPage.style.display = "none"
    })*/
