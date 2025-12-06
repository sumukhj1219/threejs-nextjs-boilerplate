import z, { ZodError } from "zod"

const envSchema = z.object({
    GITHUB_TOKEN: z.string().min(1, "GITHUB_TOKEN is required")
})

type ENV = z.infer<typeof envSchema>

function validateENV(): ENV {
    try {
        return envSchema.parse({
            GITHUB_TOKEN: process.env.GITHUB_TOKEN
        })
    } catch (error) {
        if (error instanceof ZodError) {
            const missingVars = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
            throw new Error(`Environment validation failed:\n${missingVars}`);
        }
        throw error;
    }
}

const env = validateENV()

export const ENV = {
    GITHUB_TOKEN: env.GITHUB_TOKEN
} as const;