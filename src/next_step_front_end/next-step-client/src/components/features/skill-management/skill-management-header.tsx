"use client"

import {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Search, RefreshCw, Plus} from "lucide-react"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import type {AppDispatch, RootState} from "@/store/store"
import {fetchSkills, setSearchKeyword} from "@/store/slices/skills-slice"
import {DEFAULT_LEVEL_SIZE, DEFAULT_PAGE} from "@/constants"
import {motion} from "framer-motion"

interface SkillManagementHeaderProps {
    onCreateNew: () => void
    onSearch: (keyword: string) => void
}

export function SkillManagementHeader({onCreateNew, onSearch}: SkillManagementHeaderProps) {
    const dispatch = useDispatch<AppDispatch>()
    const {statuses, searchKeyword} = useSelector((state: RootState) => state.skills)
    const [localSearchQuery, setLocalSearchQuery] = useState(searchKeyword || "")
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = async () => {
        setIsSearching(true)
        try {
            dispatch(setSearchKeyword(localSearchQuery))
            onSearch(localSearchQuery)
        } finally {
            setTimeout(() => setIsSearching(false), 500)
        }
    }

    const handleRefresh = () => {
        dispatch(
            fetchSkills({
                page: DEFAULT_PAGE,
                size: DEFAULT_LEVEL_SIZE,
                key: searchKeyword,
            }),
        )
    }

    const handleClearSearch = () => {
        setLocalSearchQuery("")
        dispatch(setSearchKeyword(""))
        onSearch("")
    }

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="space-y-4"
        >
            {/* Main Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Enhanced search input */}
                <div className="flex-1 relative group">
                    <div
                        className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"/>

                    <div
                        className="relative flex bg-background border border-border/50 rounded-xl shadow-sm group-hover:border-primary/50 transition-all duration-300 overflow-hidden">
                        <div className="flex items-center justify-center px-4 bg-muted/30 border-r border-border/30">
                            <Search
                                className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300"/>
                        </div>

                        <Input
                            type="search"
                            placeholder="Search skills by name..."
                            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-12 px-4 font-medium placeholder:text-muted-foreground/70"
                            value={localSearchQuery}
                            onChange={(e) => setLocalSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch()
                                }
                            }}
                        />
                        <Button
                            className="h-12 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-300 font-semibold shadow-none border-0 rounded-none relative overflow-hidden group/search"
                            onClick={handleSearch}
                            disabled={isSearching}
                        >
                            {isSearching ? (
                                <motion.div
                                    animate={{rotate: 360}}
                                    transition={{duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear"}}
                                >
                                    <Search className="h-4 w-4"/>
                                </motion.div>
                            ) : (
                                <>
                                    <Search
                                        className="h-4 w-4 mr-2 transition-transform duration-300 group-hover/search:scale-110"/>
                                    <span>Search</span>
                                </>
                            )}

                            <div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover/search:translate-x-[200%] transition-transform duration-700"/>
                        </Button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="lg"
                        className="h-12 gap-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 border-border/50 font-medium"
                        onClick={handleRefresh}
                        disabled={statuses.fetching === "loading"}
                    >
                        <RefreshCw
                            className={`h-4 w-4 transition-all duration-300 ${statuses.fetching === "loading" ? "animate-spin" : ""}`}
                        />
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>

                    <Button
                        size="lg"
                        onClick={onCreateNew}
                        className="h-12 gap-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 font-semibold"
                    >
                        <Plus className="h-4 w-4"/>
                        <span className="hidden sm:inline">Add Skill</span>
                        <span className="sm:hidden">Add</span>
                    </Button>
                </div>
            </div>

            {/* Active Search Display */}
            {searchKeyword && (
                <motion.div
                    initial={{opacity: 0, height: 0}}
                    animate={{opacity: 1, height: "auto"}}
                    exit={{opacity: 0, height: 0}}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                    <span>Searching for:</span>
                    <span className="font-medium text-primary">"{searchKeyword}"</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearSearch}
                        className="h-6 px-2 text-xs hover:bg-primary/10"
                    >
                        Clear
                    </Button>
                </motion.div>
            )}
        </motion.div>
    )
}
