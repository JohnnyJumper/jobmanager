const graphql = require('graphql');
const _ = require('lodash');

const Job = require('../models/jobs.models');
const Interview = require('../models/interviews.models');

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
        }
    }
})


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addJob: {
            type: JobType,
            args: {
                title: {type: new GraphQLNonNull(GraphQLString)},
                status: {type: new GraphQLNonNull(GraphQLString)},
                date: {type: new GraphQLNonNull(GraphQLString)},
                isResponded: {type: GraphQLBoolean}
            },
            resolve(parent, args){
                const {title, status, date} = args;
                const isResponded = (!args.isResponded) ? false : args.isResponded;
            
                let job = new Job();
                job.title = title;
                job.status = status;
                job.date = new Date(date);
                job.isResponded = isResponded;
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