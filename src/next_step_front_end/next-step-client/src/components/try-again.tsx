import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {AlertCircle} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

export default function TryAgain(props: { error: string }) {
    return (
        <div
            className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
            <Card className="w-full max-w-md shadow-lg border-destructive/20 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5"/>
                        Error Loading Data
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">{props.error}</p>
                    <Button onClick={() => window.location.reload()} className="w-full">
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

