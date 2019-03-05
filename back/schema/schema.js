const graphql = require('graphql');
const _ = require('lodash');

const Job = require('../models/jobs.models');
const Interview = require('../models/interviews.models');
const Company = require('../models/compnay.models');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean,
} = graphql;


const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        name: {type: GraphQLString},
        id: {type: GraphQLID},
        link: {type: GraphQLString},
        jobs: {
            type: new GraphQLList(JobType),
            resolve(parent, args) {
                return Job.find({companyID: parent.id});
            }
        }
    })
})


const InterviewType = new GraphQLObjectType({
    name: 'Interview',
    fields: () => ({
        status: {type: GraphQLString},
        date: {type: GraphQLString},
        type: {type: GraphQLString},
        id: {type: GraphQLID},
        jobID: {type: GraphQLID},
        job: {
            type: JobType,
            resolve(parent, args){
                return Job.findById(parent.jobID)
            }
        }
    })
})


const JobType = new GraphQLObjectType({
    name: 'Job',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        date: {type: GraphQLString},
        isResponded: {type: GraphQLBoolean},
        link: {type: GraphQLString},
        companyID: {type: GraphQLID},
        company: {
            type: CompanyType,
            resolve(parent, args) {
                return Company.findById(parent.companyID);
            }
        },
        interviews: {
            type: new GraphQLList(InterviewType),
            resolve(parent, args){
                return Interview.find({jobID: parent.id})
            }
        },
        phoneInterview: {
            type: new GraphQLList(InterviewType),
            resolve(parent, args){
                return Interview.find({jobID: parent.id, type: 'phone'})
            }
        },
        onSightInterview: {
          type: new GraphQLList(InterviewType),
          resolve(parent, args) {
            return Interview.find({ jobID: parent.id, type: 'on sight'})
          }
        },
        status: {type: GraphQLString}
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        company: {
            type: CompanyType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Company.findById(args.id);
            }
        },
        companies: {
            type: new GraphQLList(CompanyType),
            resolve(parent, args) {
                return Company.find({});
            }  
        },
        totalJobs: {
            type: GraphQLInt,
            resolve(parent, args) {
                return Job.count({});
            }
        },
        jobs: {
            type: new GraphQLList(JobType),
            resolve(parent, args) {
                return Job.find({});
            }
        },
        job: {
            type: JobType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parent, args){
                return Job.findById(args.id);
            }
        },
        totalInterviews: {
            type: GraphQLInt,
            resolve(parent, args){
                return Interview.count({})
            }
        },
        interview: {
            type: InterviewType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parent, args){
                return Interview.findById(args.id);
            }
        },
        interviews: {
            type: new GraphQLList(InterviewType),
            resolve(parent, args) {
                return Interview.find({});
            }
        },
        applied: {
            type: new GraphQLList(JobType),
            resolve(parent, args) {
                return Job.find({status: 'applied'});
            }
        },
        phoneScreening: {
            type: new GraphQLList(InterviewType),
            resolve(parent, args) {
                return Interview.find({status: 'phone screening'});
            }
        },
        onSight: {
            type: new GraphQLList(InterviewType),
            resolve(parent, args) {
                return Interview.find({status: 'on sight'})
            }
        },

    }
})


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCompany: {
            type: CompanyType,
            args: {
                name: {type: GraphQLString},
                link: {type: GraphQLString}
            },
            resolve(parent, args) {
                const {name, link} = args;
                let company = new Company({name, link});
                return company.save();
            }
        },
        addJob: {
            type: JobType,
            args: {
                title: {type: new GraphQLNonNull(GraphQLString)},
                status: {type: new GraphQLNonNull(GraphQLString)},
                date: {type: new GraphQLNonNull(GraphQLString)},
                isResponded: {type: GraphQLBoolean},
                companyName: {type: GraphQLString}
            },
            async resolve(parent, args){
                const {title, status, date, companyName} = args;
                const isResponded = (!args.isResponded) ? false : args.isResponded;
                let job = new Job();
                const company = await Company.findOne({name: companyName});
                job.title = title;
                job.status = status;
                job.date = new Date(date);
                job.isResponded = isResponded;
                job.companyID = company.id;
                return job.save();  
                
            }
        },
        addInterview: {
            type: InterviewType,
            args: {
                status: {type: new GraphQLNonNull(GraphQLString)},
                date: {type: new GraphQLNonNull(GraphQLString)},
                type: {type: new GraphQLNonNull(GraphQLString)},
                jobID: {type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                const {status, date, type, jobID} = args;
                let interview = new Interview();
                interview.status = status;
                interview.date = new Date(date);
                interview.type = type;
                interview.jobID = jobID;
                return interview.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})