import { IProject, Project } from "./Project"
import { showErrorPopup } from "../popup"
import { getInitials } from "../Initials"
export class ProjectsManager {

  list: Project[] = []
  ui: HTMLElement

  constructor(container: HTMLElement) {
    this.ui = container
    this.newProject({
      name: "Default Project",
      description: "This is just a default app project",
      status: "pending",
      userRole: "architect",
      finishDate: new Date()
    })
  }
  
  newProject(data:IProject) {
    const projectNames = this.list.map((project)=>{
      return project.name
    })

    const nameInUse = projectNames.includes(data.name)
    if (nameInUse) {

 
     throw showErrorPopup(`A project with the name "${data.name}" already exists`)
     /* throw new Error (`A project with the name "${data.name}" already exists`)*/
     
    }

    const project = new Project(data)

    project.ui.addEventListener("click", ()=>{
      const projectsPage = document.getElementById("projects-page")
      const detailsPage = document.getElementById("project-details")
      if (!(projectsPage && detailsPage)) { return }
      projectsPage.style.display = "none"
      detailsPage.style.display = "flex"
      this.setDetailsPage(project)
    }
    )

    
    const returnToProjectList = document.getElementById("projects-page-btn")
      if(returnToProjectList){
      returnToProjectList.addEventListener("click", ()=>{
      const projectsPage = document.getElementById("projects-page")
      const detailsPage = document.getElementById("project-details")
      if (!(projectsPage && detailsPage)) { return }
      projectsPage.style.display = "flex"
      detailsPage.style.display = "none"
      })
    }
  
  

    this.ui.append(project.ui)
    this.list.push(project)
    return project;
  }
// private -> only used internal by the Class //
 private setDetailsPage(project: Project) {
    const detailsPage = document.getElementById("project-details")
    if (!detailsPage) {return}
    const name = detailsPage.querySelector("[data-project-info = 'name']")
    if (name) {name.textContent = project.name}
   
    const cardName = detailsPage.querySelector("[data-project-info = 'card-name']")
        if (cardName) {cardName.textContent = project.name}
    
    const description = detailsPage.querySelector("[data-project-info = 'description']")
    const cardDescription = detailsPage.querySelector("[data-project-info = 'card-description']")
    if (description ) {description.textContent = project.description
    }
    if (cardDescription) {
      cardDescription.textContent = project.description 
    }

    const  status = detailsPage.querySelector("[data-project-info = 'status']")
    if (status) {status.textContent = project.status
    }

    const projectCost =  detailsPage.querySelector("[data-project-info = 'project-cost']")
    if (projectCost) {projectCost.textContent = "$" + project.cost.toString(2)
    }

    const  role = detailsPage.querySelector("[data-project-info = 'role']")
    if (role) {role.textContent = project.userRole
    }

    const  finishDate = detailsPage.querySelector("[data-project-info = 'finish-date']")
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
  };
    if (finishDate) {
      
      finishDate.textContent =project.finishDate.toLocaleDateString(undefined, options)
      
    }

    const  cardInitials = detailsPage.querySelector("[data-project-info = 'card-initials']")
    if (cardInitials) {cardInitials.textContent = getInitials(project.name)
    }
    


  }
   

  getProject(id: string){
    const project =  this.list.find((project)=>{
      
      return project.id === id
    })
    return project
  }

  getProjectByName(name: string){
    const project = this.list.find((project)=>{
      return project.name === name
      
    })

    return project
  }

  deleteProject(id: string){
    const project = this.getProject(id)
    if (!project) {return} 
    project.ui.remove()
    const remaining = this.list.filter((project)=>{
      return project.id !== id
    })
    this.list = remaining
  }

  exportToJson(fileName: string = "projects") {
    const json = JSON.stringify(this.list,null, 2)
    const blob = new Blob([json], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a =document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }
  
  importFromJson(){
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    const reader = new FileReader()
    reader.addEventListener("load", ()=>{

      const json = reader.result
      if(!json) {return}
      const projects: IProject[] = JSON.parse(json as string)

      for (const project of projects) {
        try {
          this.newProject(project)
        } catch (error){}
      }
    })
    input.addEventListener('change', ()=> {
      const filesList = input.files
      if(!filesList) {return}
      reader.readAsText(filesList[0])
    })
    input.click()
  }

}

  /*
  // my code to add all costs of all projects
 totalCostOfProjects(projects: IProject[]){
 
  const projectCosts = [];
  
  for (const project in projects) {
    
    const projectCost = this.getProject(project)?.cost

    projectCosts.push(projectCost);
    projectCosts.reduce(project.cost)
  }
}
}
 /* const projectCost = this.list.reduce(project.cost) =>
      return project.cost.reduce()
    }
      
    });
  }
}*/