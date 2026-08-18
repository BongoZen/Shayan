import * as React from "react";
import { SearchBox, Stack } from "@fluentui/react";
import { CallerGridModel } from "../models/CallerGrid";

interface PlatformAccountSearchProps {
    onSearch?: (searchText: string) => void;
    onClear?: () => void;
}

export const PlatformAccountSearch: React.FC<PlatformAccountSearchProps> = ({
    onSearch,
    onClear
}) => {

    return (
        <Stack>
            <h3>Platform Account Search</h3>

            <div
                style={{
                    width: "300px"
                }}
            >
                <SearchBox
                    placeholder="Search Platform Account Name..."
                    onSearch={(value) =>
                        onSearch?.(value ?? "")
                    }
                    onClear={() =>
                        onClear?.()
                    }
                />
            </div>
        </Stack>
    );
};