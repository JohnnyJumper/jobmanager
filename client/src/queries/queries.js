import gpl from 'graphql-tag';

export const addCompany = gpl`
mutation addCompany($name:String!, $link:String!){
    addCompany(name: $name, link:$link){
      name
      link
      id
    }
  }
`;

export const addJob = gpl`
mutation addJob($title:String! $date:String! $responded:Boolean $companyID:ID!){
    addJob(title: $title, date: $date,
                    responded: $responded, companyID: $companyID) {
      title
      date
      id
      responded
      company{
        name
        link
      }
    }
  }
`;

export const addInterview = gpl`
  mutation addInterview($type:String! $status:String! $date:String! $jobID:ID!){
  addInterview(type: $type, status:$status, date:$date, jobID:$jobID) {
    type,
    status,
    id
    date,
    job{
      id
      title
      responded
      date
      company{
	    link
        name
      }
    }
  }
}
`;

export const getJobFromInterviewForm = gpl`
  query($title: String!, $companyName: String!){ 
    job(title:$title, companyName:$companyName){
      id
    }
  }
`;

export const getCompanyFromJobForm = gpl`
  query($companyName:String!){
  company(companyName: $companyName){
    id
  }
}
`;