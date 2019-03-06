const  graphql = require('graphql');

const mongoose = require('mongoose');

const Company = require('./models/company.models');
const Job = require('./models/jobs.models');
const Interview = require('./models/interview.models');

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
    name: "company",
    fields: () => ({
        name: {type: GraphQLString},
        link: {type: GraphQLString},
        id: {type: GraphQLID},
        applied: {
            type: GraphQLInt,
            resolve(parent, args) {
                return Job.countDocuments({companyID: parent.id});
            } 
        },
        jobs: {
            type: new GraphQLList(JobType),
            resolve(parent, args) {
                return Job.find({companyID: parent.id});
            }
        },
        interviews: {
            type: new GraphQLList(InterviewType),
            async resolve(parent, args) {
                const jobs = await Job.find({companyID: parent.id});
                const jobIDS = await jobs.map(job => mongoose.Types.ObjectId(job.id));
                console.log('Job ID = ', jobIDS);
                return Interview.find({jobID: {$in: jobIDS}});
            }
        }
    })
});

const JobType = new GraphQLObjectType({
    name: "job",
    fields: () => ({
        title: {type: GraphQLString},
        date: {type: GraphQLString},
        responded: {type: GraphQLBoolean},
        companyID: {type: GraphQLID},
        id: {type: GraphQLID},
        interviews: {
            type: new GraphQLList(InterviewType),
            resolve(parent, args){
                return Interview.find({jobID: parent.id});
            }
        },
        company:{
            type: CompanyType,
            resolve(parent, args) {
                return Company.findById(parent.companyID)
            }
        }
    })
});


const InterviewType = new GraphQLObjectType({
    name: "interview",
    fields: () => ({
        type: {type: GraphQLString},
        status: {type: GraphQLString},
        date: {type: GraphQLString},
        id: {type: GraphQLID},
        jobID: {type: GraphQLID},
        job: {
            type: JobType,
            resolve(parent, args){
                return Job.findById(parent.jobID);
            }
        }
    })
});


const RootQueryType = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        companies: {
            type: new GraphQLList(CompanyType),
            resolve(parent, args) {
                return Company.find({});
            }
        },
        jobs: {
            type: new GraphQLList(JobType),
            resolve(parent, args) {
                return Job.find({});
            }
        },
        interviews: {
            type: new GraphQLList(InterviewType),
            resolve(parent, args){
                return Interview.find({})
            }
        },
        job: {
            type: JobType,
            args: {
                companyName: {type: new GraphQLNonNull(GraphQLString)},
                title: {type: new GraphQLNonNull(GraphQLString)}
            },
           async resolve(parent, args) {
               const {companyName, title} = args;
                const company = await Company.findOne({name: companyName});
                return Job.findOne({title, companyID: company.id});
            }
        },
        company: {
            type: CompanyType,
            args: {
                companyName: {type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args){
                const {companyName} = args;
                return Company.findOne({name: companyName});
            }
        },
        appliedJobs: {
            type: GraphQLInt,
            resolve(parent, args) {
                return Job.countDocuments({});
            }
        },
        appliedCompanies: {
            type: GraphQLInt,
            resolve(parent, args) {
                return Company.countDocuments({});
            }
        },
        interviewRequests: {
            type: GraphQLInt,
            resolve(parent, args) {
                return Interview.countDocuments({});
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addCompany: {
            type: CompanyType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                link: {type: new GraphQLNonNull(GraphQLString)}
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
                date: {type: new GraphQLNonNull(GraphQLString)},
                responded: {type: GraphQLBoolean},
                companyID: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                const {title, date, responded, companyID} = args;
                let job = new Job({title, date, responded, companyID});
                return job.save();
            }
        },
        addInterview: {
            type: InterviewType,
            args: {
                type:{type: new GraphQLNonNull(GraphQLString)},
                status:{type: new GraphQLNonNull(GraphQLString)},
                date:{type: new GraphQLNonNull(GraphQLString)},
                jobID:{type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args){
                const {type, status, date, jobID} = args;
                let interview = new Interview({type, status, date, jobID});
                return interview.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: Mutation
});
