import {z} from 'zod';
const status=z.enum(['Researching','Verified','Needs Review']);
const url=z.union([z.literal(''),z.url().max(1000)]).default('');
const text=z.string().trim().max(3000);
export const schemas={
 activities:z.object({name:z.string().trim().min(2).max(200),subtype:text.default(''),environment:z.enum(['Land','Water','Air']),category:z.enum(['Recreation','Adventure & Tourism','Both','Outdoor Education','Outdoor Health']),description:text.default(''),skill_level:text.default(''),equipment:text.default(''),status:status.default('Researching'),source_url:url,last_verified:z.union([z.iso.date(),z.literal('')]).default('')}),
 organisations:z.object({name:z.string().trim().min(2).max(200),organisation_type:text.default('Other'),roles:z.array(z.string().trim().min(1).max(100)).max(15).default([]),services:text.default(''),website:url,email:z.union([z.literal(''),z.email()]).default(''),phone:text.default(''),region:text.default(''),source_url:url,status:status.default('Researching'),last_verified:z.union([z.iso.date(),z.literal('')]).default('')}),
 locations:z.object({name:z.string().trim().min(2).max(200),region:text.default(''),setting:text.default(''),latitude:z.union([z.number().min(-90).max(90),z.null()]).default(null),longitude:z.union([z.number().min(-180).max(180),z.null()]).default(null),access_type:text.default(''),facilities:text.default(''),source_url:url,status:status.default('Researching'),last_verified:z.union([z.iso.date(),z.literal('')]).default('')})
};
export const relationshipSchema=z.object({activity_id:z.uuid(),organisation_id:z.uuid().nullable().default(null),location_id:z.uuid().nullable().default(null),role:z.string().trim().min(2).max(100),note:z.string().trim().max(2000).default(''),source_url:url}).refine(x=>Boolean(x.organisation_id)!==Boolean(x.location_id),{message:'Choose exactly one target: organisation or location'});
export type Resource=keyof typeof schemas;
