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
      finishDate: new Date(),
      todos: [{name: "", dueDate: ""}]
     
    })
  }
  
  newProject(data:IProject) {
    const projectNames = this.list.map((project)=>{
      return project.name
    })

    const nameInUse = projectNames.includes(data.name)
    if (nameInUse) {

 
     throw showErrorPopup(`A project with the name "${data.name}" already exists`)
   
     
    }

    // Reject Projects with Project Name <= 5 characters //
    const nameLength = data.name.length;
    if (nameLength < 5) {
      throw showErrorPopup("The project's name needs to be longer than 4 characters")
    }

    const project = new Project(data)

    project.ui.addEventListener("click", ()=>{
      const projectsPage = document.getElementById("projects-page")
      const detailsPage = document.getElementById("project-details")
      if (!(projectsPage && detailsPage)) { return }
      projectsPage.style.display = "none"
      detailsPage.style.display = "flex"
      this.setDetailsPage(project)
      this.updateDetails(project)
      this.AddToDo(project)
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


  AddToDo(project: Project){

    
    const addToDoBtn = document.getElementById("addToDoBtn") as HTMLElement;
    const todoModal = document.getElementById("todoModal") as HTMLElement;
    const closeModalBtn = document.getElementById("closeModal") as HTMLElement;
    const todoForm = document.getElementById("todoForm") as HTMLFormElement;
    const todoList = document.getElementById("todoList") as HTMLElement;


    // Open modal when "+" button is clicked
    addToDoBtn.addEventListener("click", () => {
    todoModal.style.display = "block";
    });


    // Close modal
    closeModalBtn.addEventListener("click", () => {
      todoModal.style.display = "none";
    });

    // Function to update the To-Do list in the UI
    function updateToDoList() {
      // Clear the existing list
      todoList.innerHTML = "";

      // Loop through each To-Do and create its HTML structure
      project.todos.forEach((todo) => {
        const todoItem = document.createElement("div");
        todoItem.classList.add("todo-item");

        const todoName = document.createElement("span");
        todoName.textContent = todo.name
        
        //todoName.textContent = `"${todo.name} + ${todo.dueDate}"` 

        const todoDate = document.createElement("span");
        todoDate.textContent = todo.dueDate

        todoItem.appendChild(todoName);
        todoItem.appendChild(todoDate);
        todoList.appendChild(todoItem);
      });
  }

  // Function to handle adding new To-Do
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get the input values
    const todoNameInput = document.getElementById("todoName") as HTMLInputElement;
    const todoDateInput = document.getElementById("todoDate") as HTMLInputElement;

    const todoName = todoNameInput.value;
    const todoDate = todoDateInput.value;

    // Add the new To-Do to the projects data structure
    project.todos.push( {todoName, todoDate} );

    // Clear the form
    todoNameInput.value = "";
    todoDateInput.value = "";

    // Close the modal
    todoModal.style.display = "none";

    // Update the UI to show the new To-Do
    updateToDoList();
  });
  }


  updateDetails(project: Project){
   
    //this.clickEditBtn(project)
    console.log(project.name)

    const editBtn = document.getElementById("edit-button") as HTMLElement
    
    const prName = project.description;
    console.log(prName)
    
    const nameElement = project.name 
    
    const descriptionElement = project.description
    
    const statusElement = project.status
    const costElement = project.cost
    const roleElement = project.userRole
    const finishDateElement = project.finishDate
  

  
    // Select modal elements
    const modal = document.getElementById("editModal") as HTMLElement;
    const closeModalBtn = document.getElementById("closeModalForm") as HTMLElement;
  
   
    const nameInput =  document.querySelector("[data-update-info = 'name']") as HTMLInputElement
    const descriptionInput = document.querySelector("[data-update-info = 'description']") as HTMLInputElement
    const statusInput =document.querySelector("[data-update-info = 'statusInput']") as HTMLInputElement
    const costInput = document.querySelector("[data-update-info = 'costInput']") as HTMLInputElement
    const roleInput = document.querySelector("[data-update-info = 'roleInput']") as HTMLInputElement
    const finishDateInput = document.querySelector("[data-update-info = 'finishDateInput']") as HTMLInputElement

    const editForm = document.getElementById("editForm") as HTMLFormElement;
  
  
    editBtn?.addEventListener("click", openModal)
    // Attach event listener to the close button of the modal
    closeModalBtn.addEventListener("click", closeModal);

    // Open modal and fill the input fields with current card information
    function openModal() {
      modal.classList.remove("hidden");
      modal.style.display = "flex";
  
      // Fill the inputs with current values
   

      nameInput.value = nameElement || "";
      descriptionInput.value = descriptionElement || "";
      costInput.value = costElement.toString() || "";

// !!!! CODE Breaks Here when trying to update the status input !!! //

      statusInput.value = statusElement || "";
      roleInput.value = roleElement || "";
      
      finishDateInput.value = finishDateElement.toDateString() || "";
     
    }
  
    // Close modal
    function closeModal() {
      modal.style.display = "none";
    }
  
    // Save changes from the modal form to the card
    function saveChanges(event: Event) {
      event.preventDefault();
  
      // Update card fields with new values from the form
      project.name = nameInput.value ||  "";
      project.description = descriptionInput.value;
      this.project.status.textContent = statusInput.textContent;
      project.cost = costInput.value;
      this.project.userRole.textContent = roleInput.textContent;

      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
      
        
        project.finishDate = finishDateInput.toLocaleDateString(undefined, options)
        
      
    
  
      // Close modal after saving
      closeModal();
    }
  
    // Attach event listener to the form submit to save changes
    editForm.addEventListener("submit", saveChanges);
  
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