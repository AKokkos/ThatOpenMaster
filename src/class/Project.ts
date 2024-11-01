import {v4 as uuidv4} from 'uuid'
uuidv4();


/* Biult for Typescript */
export type ProjecStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"

export interface IProject {
  name : string
  description : string
  status : ProjecStatus
  userRole : UserRole
  finishDate: Date
}

export class Project implements IProject {
    // to satisfy IProject
    name : string
    description : string
    status : "pending" | "active" | "finished"
    userRole : "architect" | "engineer" | "developer"
    finishDate: Date

    //Class internals
    ui: HTMLDivElement
    cost: number = 0
    progress: number = 0
    id: string

    constructor(data: IProject){

      // same as project data definition
      for (const key in data) {
        this[key] = data[key]
      }
      // Project Data definition (commented out as we use the code above to do the same thing)
      /*this.name = data.name
      this.description = data.description
      this.status = data.status
      this.userRole = data.userRole
      this.finishDate = data.finishDate*/
      this.id = uuidv4()
      this.setUI()
    }

    //Project card ui

    setUI(){
      if (this.ui) {return}

      this.ui = document.createElement("div")
      this.ui.className = "project-card"
      this.ui.innerHTML = `
        <div class = "project-card">
          <div>
              <div class="card-header">
                  <p style =" padding: 10px; background-color: #ca8134; border-radius: 8px; aspect-ratio: 1;">HC</p>
                  <div>
                      <h5>${this.name}</h5>
                      <p>${this.description}</p>
                  </div>
              </div>
              <div class = "card-content">
                  <div class ="card-property">
                      <p style ="color: #969696;">Status</p>
                      <p>${this.status}</p>
                  </div>
                  <div class ="card-property">
                      <p style ="color: #969696;">Role</p>
                      <p>${this.userRole}</p>
                  </div>
                  <div class ="card-property">
                      <p style ="color: #969696;">Cost</p>
                      <p>$${this.cost}</p>
                  </div>
                  <div class ="card-property">
                      <p style ="color: #969696;">Estimated Progress</p>
                      <p>${this.progress*100}%</p>
                  </div>
              </div>
      `
    }
}

