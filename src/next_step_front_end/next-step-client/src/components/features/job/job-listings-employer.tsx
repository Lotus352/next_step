"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Briefcase,
  Building,
  MapPin,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AppDispatch, RootState } from "@/store/store";
import {filterJobs, resetFilter, fetchJobById} from "@/store/slices/jobs-slice";
import { formatTextEnum } from "@/lib/utils";
import { motion } from "framer-motion";
import Loading from "@/components/loading";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {DEFAULT_JOB_SIZE, DEFAULT_PAGE, DEFAULT_JOB_FILTER} from "@/constants.ts";

export default function JobListings() {
  const dispatch: AppDispatch = useDispatch();

  const jobs = useSelector((state: RootState) => state.jobs.content);
  const status = useSelector((state: RootState) => state.jobs.status);

  useEffect(() => {
    dispatch(resetFilter());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterJobs({ page: DEFAULT_PAGE, size: DEFAULT_JOB_SIZE, filter: DEFAULT_JOB_FILTER }));
  }, [dispatch]);

  if (status === "loading" && jobs.length === 0) {
    return (
      <div className="space-y-4">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.length === 0 ? (
        <Card className="border border-primary/20 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No job listings found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-center">
              There are currently no job listings matching your criteria. Try
              adjusting your filters or check back later.
            </p>
            <Button variant="default" size="sm">
              Create New Job
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {jobs.map((job, index) => (
            <motion.div
              key={job.jobId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-200 overflow-hidden group border border-primary/20"
                onClick={() => dispatch(fetchJobById(job.jobId))}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center p-3 mt-1 group-hover:scale-110 transition-transform duration-200">
                    <Avatar className="h-6 w-6 border-0 rounded-lg">
                    <AvatarImage
                      src={job.postedBy.company.logoUrl || ""}
                      alt={`${job.postedBy.company.name} logo`}
                    />
                  </Avatar>
                    
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Building className="h-3.5 w-3.5 mr-1.5" />
                            {job.postedBy?.username ||
                              job.postedBy?.email ||
                              "Company Name"}
                          </div>
                        </div>
                        <div>
                          {job.status ? (
                            <Badge variant="default" className="text-xs">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.location && (
                          <Badge
                            variant="outline"
                            className="text-xs flex items-center gap-1 bg-primary/5 border-primary/20"
                          >
                            <MapPin className="h-3 w-3" />
                            {job.location.city}, {job.location.countryName}
                          </Badge>
                        )}
                        {job.employmentType && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                          >
                            {formatTextEnum(job.employmentType)}
                          </Badge>
                        )}
                      </div>

                      {job.detailedDescription && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                          {job.detailedDescription}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-muted/20 py-3 px-5 flex justify-between border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      {job.createdAt ? (
                        <span>
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span>Recently posted</span>
                      )}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
